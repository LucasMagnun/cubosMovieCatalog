import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../../integrations/s3.service';
import * as multerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import { PaginatedResponse } from './repository/movie.repository';
import { Movie } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: any) {
    return this.movieService.findOne(id, request.user.userId);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateMovieDto, @Req() request: any) {
    const movie = await this.movieService.create(dto, request.user.userId);
    return movie;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMovieDto,
    @Req() request: any,
  ) {
    const existingMovie = await this.movieService.findOne(
      id,
      request.user.userId,
    );
    if (!existingMovie) {
      throw new NotFoundException(`Movie with id ${id} not found`);
    }
    const movie = await this.movieService.update(id, dto, request.user.userId);

    return movie;
  }

  @Get()
  async findAll(
    @Req() request: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minDuration') minDuration?: string,
    @Query('maxDuration') maxDuration?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<PaginatedResponse<Movie>> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Converte e repassa os filtros
    const filters = {
      search,
      category,
      minDuration: minDuration ? parseInt(minDuration, 10) : undefined,
      maxDuration: maxDuration ? parseInt(maxDuration, 10) : undefined,
      startDate,
      endDate,
    };

    return this.movieService.findAll(
      request.user.userId,
      pageNumber,
      limitNumber,
      filters,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @Req() request: any) {
    return this.movieService.remove(id, request.user.userId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3({
        s3: new S3({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        }),
        bucket: process.env.AWS_BUCKET_NAME!,
        key: (req, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.MulterS3.File,
    @Body('movieId') movieId: string,
  ) {
    const imageUrl = file.location;
    return this.movieService.saveImageUrl(movieId, imageUrl);
  }

  @Delete(':id/image')
  async deleteImage(@Param('id') movieId: string) {
    return this.movieService.deleteMovieImage(movieId);
  }
}

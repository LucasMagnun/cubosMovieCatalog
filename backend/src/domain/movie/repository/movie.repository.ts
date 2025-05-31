import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Movie, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { S3Service } from 'src/integrations/s3.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class MovieRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    data: CreateMovieDto,
    categories: Category[],
    userId: string,
  ): Promise<Movie> {
    return this.prisma.movie.create({
      data: {
        title: data.title,
        originalTitle: data.originalTitle,
        description: data.description,
        releaseDate: new Date(data.releaseDate),
        recommendedAge: data.recommendedAge,
        budget: data.budget,
        boxOffice: data.boxOffice,
        studio: data.studio,
        duration: data.duration,
        rating: data.rating,
        userId: userId,
        categories: {
          connect: categories.map((cat) => ({ id: cat.id })),
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 10,
    filters: {
      search?: string;
      category?: string;
      minDuration?: number;
      maxDuration?: number;
      startDate?: string;
      endDate?: string;
    } = {},
  ): Promise<PaginatedResponse<Movie>> {
    const skip = (page - 1) * limit;

    const { search, category, minDuration, maxDuration, startDate, endDate } =
      filters;

    const where: Prisma.MovieWhereInput = {
      userId,
    };

    // Busca textual (título, título original, nome da categoria)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { originalTitle: { contains: search, mode: 'insensitive' } },
        {
          categories: {
            some: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    // Filtro por categoria
    if (category) {
      where.categories = {
        some: { id: category },
      };
    }

    // Filtro por duração
    if (minDuration || maxDuration) {
      where.duration = {};
      if (minDuration) where.duration.gte = Number(minDuration);
      if (maxDuration) where.duration.lte = Number(maxDuration);
    }

    // Filtro por data de lançamento
    if (startDate || endDate) {
      where.releaseDate = {};
      if (startDate) where.releaseDate.gte = new Date(startDate);
      if (endDate) where.releaseDate.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: { categories: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.movie.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string, userId: string): Promise<Movie | null> {
    const result = await this.prisma.movie.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (result?.userId !== userId) {
      throw new BadRequestException(
        `Movie with id ${id} not found or you do not have permission to access it.`,
      );
    }

    return result;
  }

  async update(
    id: string,
    updateData: UpdateMovieDto,
    categories?: Category[],
  ) {
    return this.prisma.movie.update({
      where: { id },
      data: {
        title: updateData.title,
        originalTitle: updateData.originalTitle,
        description: updateData.description,
        releaseDate: updateData.releaseDate
          ? new Date(updateData.releaseDate)
          : undefined,
        recommendedAge: updateData.recommendedAge,
        budget: updateData.budget,
        boxOffice: updateData.boxOffice,
        studio: updateData.studio,
        duration: updateData.duration,
        rating: updateData.rating,
        categories: categories
          ? { connect: categories.map((cat) => ({ id: cat.id })) }
          : undefined,
      },
      include: {
        categories: true,
      },
    });
  }

  async delete(id: string, userId: string): Promise<Movie> {
    return await this.prisma.movie.delete({ where: { id, userId } });
  }

  async findByReleaseDate(
    date: string,
  ): Promise<(Movie & { user: { email: string } })[]> {
    const start = new Date(date + 'T00:00:00Z');
    const end = new Date(date + 'T23:59:59Z');

    return this.prisma.movie.findMany({
      where: {
        releaseDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: true,
      },
    });
  }

  async saveImageUrl(movieId: string, imageUrl: string) {
    return this.prisma.movie.update({
      where: { id: movieId },
      data: { imageUrl },
    });
  }

  async deleteMovieImage(movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie?.imageUrl) return;

    const key = movie.imageUrl.split('/').pop();
    await this.s3Service.deleteFile(key!);

    await this.prisma.movie.update({
      where: { id: movieId },
      data: { imageUrl: null },
    });
  }
}

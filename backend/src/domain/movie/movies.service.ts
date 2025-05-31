import { Category, Movie } from '@prisma/client';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {
  MovieRepository,
  PaginatedResponse,
} from './repository/movie.repository';
import { CategoryRepository } from '../category/repository/category.repository';
import { MailService } from 'src/integrations/mail.service';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateMovieDto, userId: string): Promise<Movie> {
    const categories: Category[] = [];

    const user = await this.userRepository.findOne(userId);
    for (const categoryId of dto.categoryIds) {
      const category = await this.categoryRepository.findOne(categoryId);
      if (!category) {
        throw new NotFoundException(`Categoria não encontrada.`);
      }
      categories.push(category);
    }

    const movie = this.movieRepository.create(dto, categories, userId);

    const dataAtual = new Date();

    if ((await movie).releaseDate > dataAtual) {
      await this.mailService.sendEmail({
        to: user?.email || 'teste@gmail.com',
        subject: 'Agendamento de filme',
        text: `O filme "${dto.title}" está agendado para lançamento na data: ${dto.releaseDate}.`,
      });
    }

    return movie;
  }

  async update(
    id: string,
    dto: UpdateMovieDto,
    userId: string,
  ): Promise<Movie> {
    const movie = await this.findOne(id, userId);

    if (movie?.userId !== userId) {
      throw new BadRequestException('You are not allowed to do this.');
    }

    const categories: Category[] = [];
    if (!movie) throw new NotFoundException(`Movie ${dto.title} not found`);
    if (dto.categoryIds?.length) {
      for (const categoryId of dto.categoryIds) {
        const category = await this.categoryRepository.findOne(categoryId);
        if (!category) {
          throw new NotFoundException(`Category not found.`);
        }
        categories.push(category);
      }
    }

    return await this.movieRepository.update(id, dto, categories);
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
    return this.movieRepository.findAll(userId, page, limit, filters);
  }

  async findOne(id: string, userId: string): Promise<Movie | null> {
    return await this.movieRepository.findOne(id, userId);
  }

  async remove(id: string, userId: string) {
    return await this.movieRepository.delete(id, userId);
  }

  async saveImageUrl(movieId: string, imageUrl: string) {
    return await this.movieRepository.saveImageUrl(movieId, imageUrl);
  }

  async deleteMovieImage(movieId: string) {
    return await this.movieRepository.deleteMovieImage(movieId);
  }
}

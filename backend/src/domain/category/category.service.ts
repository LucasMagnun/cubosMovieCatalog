import { Category } from '@prisma/client';
import {
  Injectable,
} from '@nestjs/common';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  async findOne(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne(id);
  }

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  async findOne(id: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({ where: { id }, include: { movies: true } });
  }
}

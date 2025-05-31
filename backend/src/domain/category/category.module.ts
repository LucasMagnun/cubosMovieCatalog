import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoryRepository } from './repository/category.repository';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository, CategoryService],
})
export class CategoryModule {}

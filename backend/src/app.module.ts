import { Module } from '@nestjs/common';
import { UserModule } from './domain/user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MovieModule } from './domain/movie/movies.module';
import { CategoryModule } from './domain/category/category.module';
import { AuthModule } from './domain/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, UserModule, MovieModule, CategoryModule, AuthModule, ScheduleModule.forRoot()],
})
export class AppModule {}

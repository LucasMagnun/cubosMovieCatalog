import { Module } from '@nestjs/common';
import { MovieController } from './movies.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { MovieService } from './movies.service';
import { MovieRepository } from './repository/movie.repository';
import { CategoryRepository } from '../category/repository/category.repository';
import { UserRepository } from '../user/repository/user.repository';
import { MailService } from 'src/integrations/mail.service';
import { ReleaseMailScheduler } from 'src/schedulers/release-email.scheduler';
import { S3Service } from 'src/integrations/s3.service';

@Module({
  imports: [PrismaModule],
  controllers: [MovieController],
  providers: [MovieService, MovieRepository, CategoryRepository, UserRepository, MailService, ReleaseMailScheduler, S3Service],
  exports: [MovieService],
})
export class MovieModule {}

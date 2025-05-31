import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MovieRepository } from '../domain/movie/repository/movie.repository';
import { MailService } from '../integrations/mail.service';

@Injectable()
export class ReleaseMailScheduler {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly mailService: MailService,
  ) {}

  @Cron('0 8 * * *') // todos os dias às 08:00 da manhã
  async handleScheduledEmails() {
    const today = new Date().toISOString().slice(0, 10);

    const movies = await this.movieRepository.findByReleaseDate(today);

    for (const movie of movies) {
      await this.mailService.sendEmail({
        to: movie.user.email, // ajustar conforme seu modelo
        subject: `🎬 Hoje é o lançamento de "${movie.title}"!`,
        text: `O filme "${movie.title}" está sendo lançado hoje!`,
      });
    }
  }
}
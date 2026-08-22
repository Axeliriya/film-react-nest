import { FilmDto, ScheduleDto } from './dto/films.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async findAll(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmsRepository.findAll();

    return {
      total: films.length,
      items: films,
    };
  }

  async findOne(id: string): Promise<{ total: number; items: ScheduleDto[] }> {
    const film = await this.filmsRepository.findOne(id);

    if (!film) {
      throw new NotFoundException({
        error: 'Фильм не найден',
      });
    }

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }
}

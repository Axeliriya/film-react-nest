import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsPostgresRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  private parseTaken(taken: string): string[] {
    if (!taken) {
      return [];
    }

    return taken.split(',').filter(Boolean);
  }

  private parseTags(tags: string): string[] {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private stringifyTaken(taken: string[]): string {
    return taken.join(',');
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find();

    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseTags(film.tags),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    }));
  }

  async findOne(id: string): Promise<FilmWithScheduleDto | undefined> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
    });

    if (!film) {
      return undefined;
    }

    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseTags(film.tags),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule
        .sort(
          (a, b) =>
            new Date(a.daytime).getTime() - new Date(b.daytime).getTime(),
        )
        .map((session) => ({
          id: session.id,
          daytime: session.daytime,
          hall: String(session.hall),
          rows: session.rows,
          seats: session.seats,
          price: session.price,
          taken: this.parseTaken(session.taken),
        })),
    };
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const seatKey = `${row}:${seat}`;

    const session = await this.scheduleRepository.findOne({
      where: {
        id: sessionId,
        film: {
          id: filmId,
        },
      },
      relations: {
        film: true,
      },
    });

    if (!session) {
      return false;
    }

    const taken = this.parseTaken(session.taken);

    if (taken.includes(seatKey)) {
      return false;
    }

    taken.push(seatKey);

    session.taken = this.stringifyTaken(taken);

    await this.scheduleRepository.save(session);

    return true;
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const seatKey = `${row}:${seat}`;

    const session = await this.scheduleRepository.findOne({
      where: {
        id: sessionId,
        film: {
          id: filmId,
        },
      },
      relations: {
        film: true,
      },
    });

    if (!session) {
      return false;
    }

    const taken = this.parseTaken(session.taken);

    if (!taken.includes(seatKey)) {
      return false;
    }

    session.taken = this.stringifyTaken(
      taken.filter((item) => item !== seatKey),
    );

    await this.scheduleRepository.save(session);

    return true;
  }
}

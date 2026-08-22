import { Injectable } from '@nestjs/common';
import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsInMemoryRepository implements FilmsRepository {
  private readonly films: FilmWithScheduleDto[] = [];

  async findAll(): Promise<FilmDto[]> {
    return this.films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
    }));
  }

  async findOne(id: string): Promise<FilmWithScheduleDto | undefined> {
    return this.films.find((film) => film.id === id);
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const film = this.films.find((item) => item.id === filmId);

    if (!film) {
      return false;
    }

    const session = film.schedule.find((item) => item.id === sessionId);

    if (!session) {
      return false;
    }

    const seatKey = `${row}:${seat}`;

    if (session.taken.includes(seatKey)) {
      return false;
    }

    session.taken.push(seatKey);

    return true;
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const film = this.films.find((item) => item.id === filmId);

    if (!film) {
      return false;
    }

    const session = film.schedule.find((item) => item.id === sessionId);

    if (!session) {
      return false;
    }

    const seatKey = `${row}:${seat}`;
    const seatIndex = session.taken.indexOf(seatKey);

    if (seatIndex === -1) {
      return false;
    }

    session.taken.splice(seatIndex, 1);

    return true;
  }
}

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';

export interface FilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findOne(id: string): Promise<FilmWithScheduleDto | undefined>;
  bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean>;
  releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean>;
}

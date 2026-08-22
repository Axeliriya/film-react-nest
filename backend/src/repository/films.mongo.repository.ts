import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilmDto, FilmWithScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';
import { Film, FilmDocument } from './film.schema';

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();

    return films.map((film) => ({
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
    const film = await this.filmModel.findOne({ id }).lean();

    if (!film) {
      return undefined;
    }

    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedule.map((session) => ({
        id: session.id,
        daytime: session.daytime,
        hall: session.hall,
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken,
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

    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $ne: seatKey },
          },
        },
      },
      {
        $push: {
          'schedule.$.taken': seatKey,
        },
      },
    );

    return result.modifiedCount > 0;
  }

  async releaseSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const seatKey = `${row}:${seat}`;

    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
      },
      {
        $pull: {
          'schedule.$.taken': seatKey,
        },
      },
    );

    return result.modifiedCount > 0;
  }
}

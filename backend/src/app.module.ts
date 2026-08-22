import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { Film, FilmSchema } from './repository/film.schema';
import { FilmsMongoRepository } from './repository/films.mongo.repository';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from './repository/films.repository';
import { FilmsInMemoryRepository } from './repository/films.in-memory.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
    }),

    MongooseModule.forFeature([
      {
        name: Film.name,
        schema: FilmSchema,
      },
    ]),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    FilmsService,
    OrderService,
    FilmsMongoRepository,
    FilmsInMemoryRepository,
    {
      provide: FILMS_REPOSITORY,
      inject: [ConfigService, FilmsMongoRepository, FilmsInMemoryRepository],
      useFactory: (
        configService: ConfigService,
        mongoRepository: FilmsMongoRepository,
        inMemoryRepository: FilmsInMemoryRepository,
      ): FilmsRepository => {
        const driver = configService.get<string>('DATABASE_DRIVER');

        return driver === 'mongodb' ? mongoRepository : inMemoryRepository;
      },
    },
  ],
})
export class AppModule {}

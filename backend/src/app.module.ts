import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { FILMS_REPOSITORY } from './repository/films.repository';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film as FilmEntity } from './repository/entities/film.entity';
import { Schedule as ScheduleEntity } from './repository/entities/schedule.entity';
import { FilmsPostgresRepository } from './repository/films.postgres.repository';

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

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.getOrThrow<string>('DATABASE_DRIVER');

        if (driver !== 'postgres') {
          throw new Error(`Unsupported database driver: ${driver}`);
        }

        const databaseUrl = new URL(
          configService.getOrThrow<string>('DATABASE_URL'),
        );

        return {
          type: driver,
          host: databaseUrl.hostname,
          port: Number(databaseUrl.port) || 5432,
          database: databaseUrl.pathname.slice(1),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')],
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
        };
      },
    }),

    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    FilmsService,
    OrderService,
    FilmsPostgresRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsPostgresRepository,
    },
  ],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const loggerType = configService.get<string>('LOGGER', 'dev');

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );

  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  switch (loggerType) {
    case 'json':
      app.useLogger(new JsonLogger());
      break;

    case 'tskv':
      app.useLogger(new TskvLogger());
      break;

    case 'dev':
    default:
      app.useLogger(new DevLogger());
      break;
  }

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
}

bootstrap();

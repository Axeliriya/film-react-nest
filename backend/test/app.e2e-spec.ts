import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Films API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/afisha');

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/afisha/films should return films', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/afisha/films')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        items: expect.any(Array),
      }),
    );
  });

  it('GET /api/afisha/films/:id/schedule should return 400 for invalid UUID', async () => {
    await request(app.getHttpServer())
      .get('/api/afisha/films/not-a-film/schedule')
      .expect(400);
  });

  it('GET /api/afisha/films/:id/schedule should return 404 for missing film', async () => {
    const missingFilmId = '11111111-1111-4111-8111-111111111111';

    await request(app.getHttpServer())
      .get(`/api/afisha/films/${missingFilmId}/schedule`)
      .expect(404);
  });
});

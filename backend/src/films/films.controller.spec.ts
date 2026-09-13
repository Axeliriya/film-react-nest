import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: {
    findAll: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  describe('findAll', () => {
    it('should return all films from FilmsService', async () => {
      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'film-1',
            rating: 8.5,
            director: 'Test Director',
            tags: ['drama'],
            title: 'Test Film',
            about: 'About film',
            description: 'Film description',
            image: 'image.jpg',
            cover: 'cover.jpg',
            schedule: [],
          },
        ],
      };

      service.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return film schedule by id from FilmsService', async () => {
      const filmId = 'film-1';

      const expectedResult = {
        total: 1,
        items: [
          {
            id: 'session-1',
            daytime: '2026-09-13T18:00:00.000Z',
            hall: 1,
            rows: 10,
            seats: 20,
            price: 500,
            taken: [],
          },
        ],
      };

      service.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(filmId);

      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(expectedResult);
    });
  });
});

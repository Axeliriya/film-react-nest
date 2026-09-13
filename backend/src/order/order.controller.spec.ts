import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: {
    create: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  describe('create', () => {
    it('should create an order using OrderService', async () => {
      const order = {
        email: 'test@example.com',
        phone: '+79990000000',
        tickets: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-09-13T18:00:00.000Z',
            row: 1,
            seat: 2,
            price: 500,
          },
        ],
      };

      const expectedResult = {
        total: 1,
        items: [
          {
            film: 'film-1',
            session: 'session-1',
            daytime: '2026-09-13T18:00:00.000Z',
            row: 1,
            seat: 2,
            price: 500,
          },
        ],
      };

      service.create.mockResolvedValue(expectedResult);

      const result = await controller.create(order);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(order);
      expect(result).toEqual(expectedResult);
    });
  });
});

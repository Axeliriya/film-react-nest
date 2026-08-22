import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  CreateOrderDto,
  OrderResponseDto,
  OrderTicketDto,
  TicketDto,
} from './dto/order.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async create(order: CreateOrderDto): Promise<OrderResponseDto> {
    const items: OrderTicketDto[] = [];
    const bookedTickets: TicketDto[] = [];

    try {
      for (const ticket of order.tickets) {
        const booked = await this.filmsRepository.bookSeat(
          ticket.film,
          ticket.session,
          ticket.row,
          ticket.seat,
        );

        if (!booked) {
          throw new BadRequestException({
            error: `Ряд ${ticket.row}, место ${ticket.seat} уже занято или сеанс не найден`,
          });
        }

        bookedTickets.push(ticket);

        items.push({
          ...ticket,
          id: randomUUID(),
        });
      }

      return {
        total: items.length,
        items,
      };
    } catch (error) {
      for (const ticket of bookedTickets) {
        await this.filmsRepository.releaseSeat(
          ticket.film,
          ticket.session,
          ticket.row,
          ticket.seat,
        );
      }

      throw error;
    }
  }
}

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  create(@Body() order: CreateOrderDto) {
    return this.orderService.create(order);
  }
}

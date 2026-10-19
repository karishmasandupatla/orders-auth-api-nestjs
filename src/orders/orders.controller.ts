import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('api/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body() dto: CreateOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.createOrder(dto, req.user);
  }

  @Get()
  getOrders(@Req() req: AuthenticatedRequest) {
    return this.ordersService.getOrders(req.user);
  }

  @Get(':id')
  getOrderById(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.getOrderById(id, req.user);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}

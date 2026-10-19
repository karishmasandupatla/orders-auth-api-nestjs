import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Role } from '@prisma/client';
import { AuthUser } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto, currentUser: AuthUser) {
    const totalAmount = dto.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId: currentUser.userId,
        items: dto.items as unknown as Prisma.InputJsonValue,
        totalAmount,
      },
    });

    return { success: true, data: order };
  }

  async getOrders(currentUser: AuthUser) {
    const orders =
      currentUser.role === Role.ADMIN
        ? await this.prisma.order.findMany()
        : await this.prisma.order.findMany({
            where: { userId: currentUser.userId },
          });

    return { success: true, data: orders };
  }

  async getOrderById(id: string, currentUser: AuthUser) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      currentUser.role !== Role.ADMIN &&
      order.userId !== currentUser.userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return { success: true, data: order };
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });

    return { success: true, data: updatedOrder };
  }

  async deleteOrder(id: string) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const deletedOrder = await this.prisma.order.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Order deleted successfully',
      data: deletedOrder,
    };
  }
}

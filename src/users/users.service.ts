import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: safeUserSelect,
    });

    return { success: true, data: users };
  }

  async getUserById(id: string, currentUser: AuthUser) {
    if (currentUser.role !== Role.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { success: true, data: user };
  }

  async updateUser(id: string, dto: UpdateUserDto, currentUser: AuthUser) {
    if (currentUser.role !== Role.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('Access denied');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
      },
      select: safeUserSelect,
    });

    return { success: true, data: user };
  }

  async deleteUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const orderCount = await this.prisma.order.count({
      where: { userId: id },
    });

    if (orderCount > 0) {
      throw new ConflictException(
        'Cannot delete user because they have existing orders.',
      );
    }

    const user = await this.prisma.user.delete({ where: { id } });

    return {
      success: true,
      message: 'User deleted successfully',
      data: user,
    };
  }
}

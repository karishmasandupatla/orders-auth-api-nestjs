import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard, AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Req } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.usersService.getUserById(id, req.user);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.usersService.updateUser(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}

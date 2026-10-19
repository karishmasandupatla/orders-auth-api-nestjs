import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { Request } from 'express';

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is required');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (
        typeof decoded !== 'object' ||
        !decoded ||
        typeof decoded.userId !== 'string' ||
        typeof decoded.email !== 'string' ||
        !Object.values(Role).includes(decoded.role as Role)
      ) {
        throw new Error('Invalid payload');
      }

      request.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role as Role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

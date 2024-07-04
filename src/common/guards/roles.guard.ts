/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

import { type Role } from '@prisma/client';
import { ErrorResponse } from 'common/responses';

import { PrismaService } from 'infra/database/prisma/prisma.service';

@Injectable()
@ApiUnauthorizedResponse({
  description: 'Permission denied',
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  description: 'You are not allowed to access this route',
  type: ErrorResponse,
})
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Permission denied');
    }

    const user = await this.validate(token);

    return requiredRoles.some(role => user.role.includes(role));
  }

  async validate(
    token: string,
  ): Promise<{ sub: string; username: string; role: string }> {
    interface user {
      id: string;
      username: string;
      role: Role;
    }

    const decodedToken: user = this.jwt.decode(token);

    if (!decodedToken) {
      return null;
    }

    const user = await this.prisma.users.findUnique({
      where: {
        username: decodedToken.username,
      },
    });

    if (!user) {
      throw new ForbiddenException('You are not allowed to access this route');
    }

    return {
      sub: user.id,
      username: user.username,
      role: decodedToken.role,
    };
  }

  extractToken(request: any): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const token = authHeader.split(' ')[1];

    return token;
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { getTokens, hashData } from 'utils';

import { type GantiPasswordDto, type LoginDto, type RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string) {
    return await this.prisma.users.findFirst({
      where: { username },
    });
  }

  async login(data: LoginDto) {
    const isUserExist = await this.findByUsername(data.username);

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    const isPassword = bcrypt.compareSync(data.password, isUserExist.password);

    if (!isPassword) {
      throw new UnauthorizedException('Wrong username or password');
    }

    const tokens = await getTokens(
      isUserExist.id,
      isUserExist.username,
      isUserExist.role,
    );

    await this.updateRefreshToken(isUserExist.id, tokens.refresh_token);

    return {
      ...tokens,
      role: isUserExist.role,
    };
  }

  async register(data: RegisterDto) {
    const isUserExist = await this.findByUsername(data.username);

    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    if (data.gi_id) {
      const isGIExist = await this.prisma.gi.findFirst({
        where: { id: data.gi_id },
      });

      if (!isGIExist) {
        throw new NotFoundException('GI not found');
      }
    }

    const password = hashData(data.password);

    return await this.prisma.users.create({
      data: {
        ...data,
        password,
      },
    });
  }

  async updateRefreshToken(user_id: string, refresh_token: string) {
    return await this.prisma.users.update({
      where: { id: user_id },
      data: {
        refresh_token,
      },
    });
  }

  async logout(user_id: string) {
    return await this.prisma.users.update({
      where: { id: user_id },
      data: {
        refresh_token: null,
      },
    });
  }

  async userMe(user_id: string) {
    return await this.prisma.users.findFirst({
      where: { id: user_id },
      select: {
        id: true,
        username: true,
        role: true,
        gi_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async gantiPassword(user_id: string, data: GantiPasswordDto) {
    if (data.password !== data.confirm_password) {
      throw new ConflictException('Password not match');
    }

    const password = hashData(data.confirm_password);

    return await this.prisma.users.update({
      where: { id: user_id },
      data: {
        password,
      },
    });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { getTokens, hashData } from 'utils';

import { type LoginDto, type RegisterDto } from './dto';

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

    // await this.updateRefreshToken(user.id, tokens.refresh_token);

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
}

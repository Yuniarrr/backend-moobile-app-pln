/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { decodeRefreshToken, getTokens, hashData } from 'utils';

import {
  type RefreshTokenDto,
  type GantiPasswordDto,
  type LoginDto,
  type RegisterDto,
} from './dto';

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
      throw new NotFoundException('Username atau password salah');
    }

    const isPassword = bcrypt.compareSync(data.password, isUserExist.password);

    if (!isPassword) {
      throw new NotFoundException('Username atau password salah');
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
      user_id: isUserExist.id,
      username: isUserExist.username,
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
        created_at: true,
        updated_at: true,
        gi: {
          select: {
            nama: true,
          },
        },
        ultg: {
          select: {
            nama: true,
          },
        },
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

  async refreshToken(data: RefreshTokenDto) {
    const user = await decodeRefreshToken(data.refresh_token);

    // const currentTime = Math.floor(Date.now() / 1000);

    // if (user.exp < currentTime) {
    //   throw new UnauthorizedException('Token has expired. Please login');
    // }

    const tokens = await getTokens(user.user_id, user.email, user.role);

    await this.updateRefreshToken(user.user_id, tokens.refresh_token);

    return tokens;
  }
}

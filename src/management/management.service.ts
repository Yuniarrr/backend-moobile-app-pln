import { Injectable, NotFoundException } from '@nestjs/common';

import { type Prisma } from '@prisma/client';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { hashData } from 'utils';

import {
  type UpdateUserDto,
  type CreateUserDto,
  type UpdateGIDto,
  type CreateGIDto,
  type UpdateULTGDto,
  type CreateULTGDto,
} from './dto';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async createUltg(data: CreateULTGDto) {
    return await this.prisma.ultg.create({
      data: {
        ...data,
      },
    });
  }

  async createGi(data: CreateGIDto) {
    await this.checkUltg(data.ultg_id);

    return await this.prisma.gi.create({
      data: {
        ...data,
      },
    });
  }

  async checkUltg(id: string) {
    const isUltgExist = await this.prisma.ultg.findFirst({ where: { id } });

    if (!isUltgExist) {
      throw new NotFoundException('ULTG not found');
    }

    return isUltgExist;
  }

  async getDetailUltg(ultg_id: string) {
    await this.checkUltg(ultg_id);

    return await this.prisma.ultg.findFirst({
      where: { id: ultg_id },
      include: {
        gi: true,
      },
    });
  }

  async updateUltg(ultg_id: string, data: UpdateULTGDto) {
    await this.checkUltg(ultg_id);

    return await this.prisma.ultg.update({
      where: { id: ultg_id },
      data: {
        ...data,
      },
    });
  }

  async updateGI(gi_id: string, data: UpdateGIDto) {
    const isGIExist = await this.prisma.gi.findFirst({ where: { id: gi_id } });

    if (!isGIExist) {
      throw new NotFoundException('GI not found');
    }

    return await this.prisma.gi.update({
      where: { id: gi_id },
      data: {
        ...data,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    await this.checkUsername(data.username);

    const password = hashData(data.password);

    delete data.password;

    return await this.prisma.users.create({
      data: {
        ...data,
        password,
      },
    });
  }

  async updateUser(user_id: string, data: UpdateUserDto) {
    const isUserExist = await this.prisma.users.findFirst({
      where: { id: user_id },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    if (data.username) {
      await this.checkUsername(data.username);
    }

    return await this.prisma.users.update({
      where: { id: user_id },
      data: {
        ...data,
        password: data.password
          ? hashData(data.password)
          : isUserExist.password,
      },
    });
  }

  async checkUsername(username: string) {
    const isUsernameExist = await this.prisma.users.findFirst({
      where: { username },
    });

    if (isUsernameExist) {
      throw new NotFoundException('Username already exist');
    }

    return isUsernameExist;
  }

  async getDetailGI(gi_id: string) {
    const isGIExist = await this.prisma.gi.findFirst({ where: { id: gi_id } });

    if (!isGIExist) {
      throw new NotFoundException('GI not found');
    }

    return await this.prisma.gi.findFirst({
      where: { id: gi_id },
      include: {
        users: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async getListBay(gi_id: string) {
    const isGIExist = await this.prisma.gi.findFirst({ where: { id: gi_id } });

    if (!isGIExist) {
      throw new NotFoundException('GI not found');
    }

    return await this.prisma.bay.findMany({
      where: { gi_id },
    });
  }

  async getUsers({
    where,
    page,
    perPage,
  }: {
    where: Prisma.usersWhereInput;
    page?: number;
    perPage?: number;
  }) {
    const skip = page > 0 ? perPage * (page - 1) : 0;

    const [total, data] = await Promise.all([
      this.prisma.users.count({
        where,
      }),
      this.prisma.users.findMany({
        skip,
        take: perPage,
        where,
        select: {
          id: true,
          username: true,
          role: true,
          gi_id: true,
          gi: {
            select: {
              id: true,
              nama: true,
              ultg: {
                select: {
                  id: true,
                  nama: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
      data,
    };
  }

  async getUltg(ultg_id?: string) {
    return await this.prisma.ultg.findMany({
      where: { id: ultg_id },
      include: {
        gi: true,
      },
    });
  }

  async deleteUser(user_id: string) {
    const isUserExist = await this.prisma.users.findFirst({
      where: { id: user_id },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.users.delete({
      where: { id: user_id },
    });
  }

  async getGI() {
    return await this.prisma.gi.findMany({
      select: {
        id: true,
        nama: true,
        bay: {
          select: {
            id: true,
            nama_lokasi: true,
          },
        },
      },
    });
  }

  async getDetailUser(user_id: string) {
    const isUserExist = await this.prisma.users.findFirst({
      where: { id: user_id },
    });

    if (!isUserExist) {
      throw new NotFoundException('User not found');
    }

    return await this.prisma.users.findFirst({
      where: { id: user_id },
      select: {
        id: true,
        username: true,
        role: true,
        gi_id: true,
        gi: {
          select: {
            id: true,
            nama: true,
            ultg: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },
    });
  }
}

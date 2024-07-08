import { Injectable } from '@nestjs/common';

import { PrismaService } from 'infra/database/prisma/prisma.service';

import { type CreateAlatDto, type CreateJenisAlatDto } from './dto';

@Injectable()
export class InventarisService {
  constructor(private readonly prisma: PrismaService) {}

  async createJenisAlat(data: CreateJenisAlatDto) {
    return 'This action adds a new inventaris';
  }

  async createAlat(data: CreateAlatDto) {
    return `This action returns all inventaris`;
  }
}

import { Injectable } from '@nestjs/common';

import { type CreateLaporanDto } from './dto/create-laporan.dto';
import { type UpdateLaporanDto } from './dto/update-laporan.dto';

@Injectable()
export class LaporanService {
  create(createLaporanDto: CreateLaporanDto) {
    return 'This action adds a new laporan';
  }

  findAll() {
    return `This action returns all laporan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} laporan`;
  }

  update(id: number, updateLaporanDto: UpdateLaporanDto) {
    return `This action updates a #${id} laporan`;
  }

  remove(id: number) {
    return `This action removes a #${id} laporan`;
  }
}

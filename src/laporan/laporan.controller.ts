/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateLaporanDto } from './dto/create-laporan.dto';
import { UpdateLaporanDto } from './dto/update-laporan.dto';
import { LaporanService } from './laporan.service';

@ApiTags('laporan')
@Controller('laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Post()
  create(@Body() createLaporanDto: CreateLaporanDto) {
    return this.laporanService.create(createLaporanDto);
  }

  @Get()
  findAll() {
    return this.laporanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.laporanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLaporanDto: UpdateLaporanDto) {
    return this.laporanService.update(+id, updateLaporanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.laporanService.remove(+id);
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ValidationPipe,
  HttpStatus,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { type Prisma, Kategori, StatusLaporan } from '@prisma/client';
import {
  ErrorResponse,
  GetUser,
  JwtGuard,
  Roles,
  RolesGuard,
  SuccessResponse,
} from 'common';
import { FileInjector } from 'nestjs-file-upload';

import {
  CREATE_LAPORAN_ANOMALI_BODY,
  CREATE_LAPORAN_TINDAK_LANJUT_BODY,
  UPDATE_LAPORAN_ANOMALI_BODY,
  UPDATE_LAPORAN_TINDAK_LANJUT_BODY,
} from './decorators';
import {
  CreateLaporanAnomaliDto,
  CreateLaporanTindakLanjutDto,
  UpdateLaporanAnomaliDto,
  UpdateLaporanTindakLanjutDto,
} from './dto';
import { LaporanService } from './laporan.service';

@ApiTags('laporan')
@Controller('laporan')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiCreatedResponse({
  description: 'The record has been successfully created.',
  type: SuccessResponse,
})
@ApiOkResponse({
  description: 'The record has been successfully created.',
  type: SuccessResponse,
})
@ApiNotFoundResponse({
  description: 'Record not found',
  type: ErrorResponse,
})
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
  type: ErrorResponse,
})
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  @Post('anomali')
  @Roles('ADMIN', 'GI')
  @ApiConsumes('multipart/form-data')
  @CREATE_LAPORAN_ANOMALI_BODY()
  @FileInjector(CreateLaporanAnomaliDto)
  async createLaporanAnomali(
    @Body(ValidationPipe) data: CreateLaporanAnomaliDto,
    @GetUser('id') user_id: string,
  ) {
    const newLaporan = await this.laporanService.createLaporanAnomali(
      data,
      user_id,
    );

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Laporan Anomali berhasil dibuat',
      newLaporan,
    );
  }

  @Post('tindak/lanjut')
  @Roles('ADMIN', 'GI', 'HAR')
  @ApiConsumes('multipart/form-data')
  @CREATE_LAPORAN_TINDAK_LANJUT_BODY()
  @FileInjector(CreateLaporanTindakLanjutDto)
  async createLaporanTindakLanjut(
    @Body(ValidationPipe) data: CreateLaporanTindakLanjutDto,
    @GetUser('id') user_id: string,
  ) {
    const newLaporan = await this.laporanService.createLaporanTindakLanjut(
      data,
      user_id,
    );

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Laporan Tindak Lanjut berhasil dibuat',
      newLaporan,
    );
  }

  @Get('total-anomali')
  @Roles('ADMIN', 'GI', 'HAR')
  async getTotalLaporanAnomali() {
    const laporan = await this.laporanService.getTotalLaporanAnomali();

    return new SuccessResponse(
      HttpStatus.OK,
      'Data Laporan Anomali berhasil didapatkan',
      laporan,
    );
  }

  @Get('anomali')
  @ApiQuery({
    name: 'gi_id',
    required: false,
    type: String,
    description: 'ID GI',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: [String],
    enum: [StatusLaporan.CLOSE, StatusLaporan.DELETE, StatusLaporan.OPEN],
    description: 'Status Laporan',
  })
  @ApiQuery({
    name: 'kategori',
    required: false,
    type: [String],
    enum: [Kategori.K1, Kategori.K2, Kategori.K3, Kategori.K4],
    description: 'Kategori Laporan',
  })
  @Roles('ADMIN', 'GI', 'HAR')
  async getLaporanAnomali(
    @Query('gi_id') gi_id: string,
    @Query('status') status: StatusLaporan,
    @Query('kategori') kategori: Kategori,
  ) {
    const formatStatus: StatusLaporan[] = status
      ? status
          .toUpperCase()
          .replace('HAPUS', 'DELETE')
          .split(',')
          .map(s => StatusLaporan[s as keyof typeof StatusLaporan])
      : [];
    const formatKategori: Kategori[] = kategori
      ? kategori.split(',').map(k => Kategori[k as keyof typeof Kategori])
      : [];

    const where: Prisma.laporan_anomaliWhereInput = {
      gi_id,
      ...(status && { status: { in: formatStatus } }),
      ...(kategori && { kategori: { in: formatKategori } }),
    };

    const laporan = await this.laporanService.getLaporanAnomali(where);

    return new SuccessResponse(
      HttpStatus.OK,
      'Data Laporan Anomali berhasil didapatkan',
      laporan,
    );
  }

  @Get('anomali/:laporan_anomali_id')
  @Roles('ADMIN', 'GI', 'HAR')
  async getDetailLaporanAnomali(
    @Param('laporan_anomali_id') laporan_anomali_id: string,
  ) {
    const laporan = await this.laporanService.getDetailLaporanAnomali(
      laporan_anomali_id,
    );

    return new SuccessResponse(
      HttpStatus.OK,
      'Data Laporan Anomali berhasil didapatkan',
      laporan,
    );
  }

  @Patch('anomali/:laporan_anomali_id')
  @Roles('ADMIN', 'GI')
  @ApiConsumes('multipart/form-data')
  @UPDATE_LAPORAN_ANOMALI_BODY()
  @FileInjector(UpdateLaporanAnomaliDto)
  async updateLaporanAnomali(
    @Param('laporan_anomali_id') laporan_anomali_id: string,
    @Body(ValidationPipe) data: UpdateLaporanAnomaliDto,
    @GetUser('id') user_id: string,
  ) {
    const update = await this.laporanService.updateLaporanAnomali(
      laporan_anomali_id,
      data,
      user_id,
    );

    return new SuccessResponse(
      HttpStatus.OK,
      'Laporan Anomali berhasil diupdate',
      update,
    );
  }

  @Patch('tindak/lanjut/:laporan_tindak_lanjut_id')
  @Roles('ADMIN', 'GI')
  @ApiConsumes('multipart/form-data')
  @UPDATE_LAPORAN_TINDAK_LANJUT_BODY()
  @FileInjector(UpdateLaporanTindakLanjutDto)
  async updateLaporanTindakLanjut(
    @Param('laporan_tindak_lanjut_id') laporan_tindak_lanjut_id: string,
    @Body(ValidationPipe) data: UpdateLaporanTindakLanjutDto,
    @GetUser('id') user_id: string,
  ) {
    const update = await this.laporanService.updateLaporanTindakLanjut(
      laporan_tindak_lanjut_id,
      data,
      user_id,
    );

    return new SuccessResponse(
      HttpStatus.OK,
      'Laporan Anomali berhasil diupdate',
      update,
    );
  }

  @Delete('anomali/:laporan_anomali_id')
  @Roles('ADMIN', 'GI')
  async deleteLaporanAnomali(
    @Param('laporan_anomali_id') laporan_anomali_id: string,
  ) {
    await this.laporanService.deleteLaporanAnomali(laporan_anomali_id);

    return new SuccessResponse(
      HttpStatus.OK,
      'Laporan Anomali berhasil dihapus',
    );
  }
}

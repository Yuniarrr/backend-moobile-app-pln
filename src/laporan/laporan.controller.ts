/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  UseInterceptors,
  UploadedFile,
  UsePipes,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
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
import { Response } from 'express';

import { UPDATE_LAPORAN_TINDAK_LANJUT_BODY } from './decorators';
import {
  CreateLaporanAnomaliDto,
  CreateLaporanTindakLanjutDto,
  CreateRencanaPenyelesaianDto,
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

  @Get('custom-update')
  async update() {
    await this.laporanService.update();

    return new SuccessResponse(
      HttpStatus.OK,
      'Data Laporan Anomali berhasil didapatkan',
    );
  }

  @Post('anomali')
  @Roles('ADMIN', 'GI')
  @ApiConsumes('multipart/form-data')
  // @CREATE_LAPORAN_ANOMALI_BODY()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto', maxCount: 1 },
      { name: 'berita_acara', maxCount: 1 },
    ]),
  )
  async createLaporanAnomali(
    @Body(ValidationPipe) data: CreateLaporanAnomaliDto,
    @GetUser('id') user_id: string,
    @UploadedFiles()
    files: {
      foto?: Express.Multer.File[];
      berita_acara?: Express.Multer.File[];
    },
  ) {
    const newLaporan = await this.laporanService.createLaporanAnomali(
      data,
      user_id,
      files.foto,
      files.berita_acara,
    );

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Laporan Anomali berhasil dibuat',
      newLaporan,
    );
  }

  @Post('tindak/lanjut')
  @Roles('ADMIN', 'GI', 'ULTG')
  // @ApiConsumes('multipart/form-data')
  // @CREATE_LAPORAN_TINDAK_LANJUT_BODY()
  // @FileInjector(CreateLaporanTindakLanjutDto)
  // @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto', maxCount: 1 },
      { name: 'berita_acara', maxCount: 1 },
    ]),
  )
  async createLaporanTindakLanjut(
    @Body(ValidationPipe) data: CreateLaporanTindakLanjutDto,
    @GetUser('id') user_id: string,
    @UploadedFiles()
    files: {
      foto?: Express.Multer.File[];
      berita_acara?: Express.Multer.File[];
    },
  ) {
    const newLaporan = await this.laporanService.createLaporanTindakLanjut(
      data,
      user_id,
      files.foto,
      files.berita_acara,
    );

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Laporan Tindak Lanjut berhasil dibuat',
      newLaporan,
    );
  }

  @Post('rencana/penyelesaian')
  @Roles('ADMIN', 'GI', 'ULTG')
  async createRencanaPenyelesaian(
    @Body(ValidationPipe) data: CreateRencanaPenyelesaianDto,
    @GetUser('id') user_id: string,
  ) {
    const rencana = await this.laporanService.createRencanaPenyelesaian(
      data,
      user_id,
    );

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Rencana Penyelesaian berhasil dibuat',
      rencana,
    );
  }

  @Get('total-anomali')
  @Roles('ADMIN', 'GI', 'ULTG')
  @ApiQuery({
    name: 'bulan',
    required: false,
    type: String,
    description: 'Bulan',
  })
  @ApiQuery({
    name: 'tahun',
    required: false,
    type: String,
    description: 'Tahun',
  })
  async getTotalLaporanAnomali(
    @Query('bulan') bulan?: string,
    @Query('tahun') tahun?: string,
  ) {
    const laporan = await this.laporanService.getTotalLaporanAnomali({
      bulan,
      tahun,
    });

    return new SuccessResponse(
      HttpStatus.OK,
      'Data Laporan Anomali berhasil didapatkan',
      laporan,
    );
  }

  @Get('download')
  @Roles('ADMIN', 'GI', 'ULTG')
  @ApiQuery({
    name: 'tipe',
    required: false,
    type: String,
    enum: ['Tindak Lanjut', 'Laporan Anomali'],
    description: 'Tipe Laporan',
  })
  @ApiQuery({
    name: 'awal',
    required: false,
    type: String,
    description: 'Tanggal awal Laporan',
  })
  @ApiQuery({
    name: 'akhir',
    required: false,
    type: String,
    description: 'Tanggal akhir Laporan',
  })
  async unduhLaporan(
    @Res() response: Response,
    @Query('tipe') tipe?: string,
    @Query('awal') awal?: string,
    @Query('akhir') akhir?: string,
  ) {
    await this.laporanService.unduhLaporan({
      tipe,
      awal,
      akhir,
      response,
    });
  }

  @Get('anomali')
  @ApiQuery({
    name: 'gi_id',
    required: false,
    type: String,
    description: 'ID GI',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search Laporan',
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (optional)',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Per page (optional)',
  })
  @Roles('ADMIN', 'GI', 'ULTG')
  async getLaporanAnomali(
    @Query('gi_id') gi_id: string,
    @Query('status') status: StatusLaporan,
    @Query('kategori') kategori: Kategori,
    @Query('page') page: number | undefined,
    @Query('perPage') perPage: number | undefined,
    @Query('search') search: string | undefined,
  ) {
    const sanitizedPage = Number.isNaN(page) ? 1 : page;
    const sanitizedPerPage = Number.isNaN(perPage) ? 20 : perPage;

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

    const laporan = await this.laporanService.getLaporanAnomali({
      where,
      page: sanitizedPage,
      perPage: sanitizedPerPage,
      search,
    });

    return new SuccessResponse(
      HttpStatus.OK,
      'Data Laporan Anomali berhasil didapatkan',
      laporan,
    );
  }

  @Get('anomali/:laporan_anomali_id')
  @Roles('ADMIN', 'GI', 'ULTG')
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
  @Roles('ADMIN', 'GI', 'ULTG')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'foto', maxCount: 1 },
      { name: 'berita_acara', maxCount: 1 },
    ]),
  )
  async updateLaporanAnomali(
    @Param('laporan_anomali_id') laporan_anomali_id: string,
    @Body(ValidationPipe) data: UpdateLaporanAnomaliDto,
    @GetUser('id') user_id: string,
    @UploadedFiles()
    files: {
      foto?: Express.Multer.File[];
      berita_acara?: Express.Multer.File[];
    },
  ) {
    const update = await this.laporanService.updateLaporanAnomali(
      laporan_anomali_id,
      data,
      user_id,
      files.foto,
      files.berita_acara,
    );

    return new SuccessResponse(
      HttpStatus.OK,
      'Laporan Anomali berhasil diupdate',
      update,
    );
  }

  @Patch('tindak/lanjut/:laporan_tindak_lanjut_id')
  @Roles('ADMIN', 'GI', 'ULTG')
  @ApiConsumes('multipart/form-data')
  @UPDATE_LAPORAN_TINDAK_LANJUT_BODY()
  // @FileInjector(UpdateLaporanTindakLanjutDto)
  @UseInterceptors(FileInterceptor('nameplate'))
  @UseInterceptors(FileInterceptor('berita_acara'))
  async updateLaporanTindakLanjut(
    @Param('laporan_tindak_lanjut_id') laporan_tindak_lanjut_id: string,
    @Body(ValidationPipe) data: UpdateLaporanTindakLanjutDto,
    @GetUser('id') user_id: string,
    @UploadedFile() nameplate: Express.Multer.File | null,
    @UploadedFile() berita_acara: Express.Multer.File | null,
  ) {
    const update = await this.laporanService.updateLaporanTindakLanjut(
      laporan_tindak_lanjut_id,
      data,
      user_id,
      nameplate,
      berita_acara,
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

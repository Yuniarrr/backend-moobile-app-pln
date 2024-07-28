/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  ValidationPipe,
  Query,
  UseInterceptors,
  UsePipes,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

import { KategoriPeralatan } from '@prisma/client';
import {
  ErrorResponse,
  GetUser,
  JwtGuard,
  Roles,
  RolesGuard,
  SuccessResponse,
} from 'common';
import { type Response } from 'express';
import { FileInjector } from 'nestjs-file-upload';

import { CREATE_ALAT_BODY, CREATE_UPLOAD_BODY } from './decorators';
import {
  CreateAlatDto,
  CreateJenisAlatDto,
  UpdateAlatDto,
  UpdateJenisAlatDto,
} from './dto';
import { InventarisService } from './inventaris.service';

@ApiTags('inventaris')
@Controller('inventaris')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiOkResponse({
  description: 'The record has been successfully created.',
  type: SuccessResponse,
})
@ApiCreatedResponse({
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
export class InventarisController {
  constructor(private readonly inventarisService: InventarisService) {}

  @Post('alat')
  @Roles('ADMIN', 'GI', 'HAR')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('nameplate'))
  async createAlat(
    @Body(ValidationPipe) data: CreateAlatDto,
    @GetUser('id') user_id: string,
    @UploadedFile() nameplate: Express.Multer.File | null,
  ) {
    const alat = await this.inventarisService.createAlat(
      data,
      user_id,
      nameplate,
    );

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Alat berhasil ditambahkan',
      alat,
    );
  }

  @Post('upload/alat')
  @Roles('ADMIN')
  @CREATE_UPLOAD_BODY()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadManajemenData(
    @UploadedFile() file: Express.Multer.File | null,
    @GetUser('id') user_id: string,
  ) {
    await this.inventarisService.createFromFile(file, user_id);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'The record has been successfully created.',
    );
  }

  @Post('jenis/alat')
  @Roles('ADMIN', 'GI', 'HAR')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  async createJenisAlat(@Body(ValidationPipe) data: CreateJenisAlatDto) {
    const alat = await this.inventarisService.createJenisAlat(data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Alat berhasil ditambahkan',
      alat,
    );
  }

  @Get('jenis/alat')
  @ApiQuery({
    name: 'kategori_alat',
    required: false,
    type: String,
    enum: [
      KategoriPeralatan.PENDUKUNG,
      KategoriPeralatan.PRIMER,
      KategoriPeralatan.SEKUNDER,
    ],
    description: 'Kategori Alat',
  })
  @Roles('ADMIN', 'GI', 'HAR')
  async getJenisAlat(@Query('kategori_alat') kategori_alat: KategoriPeralatan) {
    const alat = await this.inventarisService.getJenisAlat(kategori_alat);

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil ditemukan', alat);
  }

  @Get('alat')
  @ApiQuery({
    name: 'ultg_id',
    required: false,
    type: String,
    description: 'ID ULTG',
  })
  @ApiQuery({
    name: 'gi_id',
    required: false,
    type: String,
    description: 'ID GI',
  })
  @ApiQuery({
    name: 'jenis_peralatan_id',
    required: false,
    type: String,
    description: 'ID Jenis Peralatan',
  })
  @ApiQuery({
    name: 'bay_id',
    required: false,
    type: String,
    description: 'ID Bay',
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
  @Roles('ADMIN', 'GI', 'HAR')
  async getAlat(
    @Query('ultg_id') ultg_id: string,
    @Query('gi_id') gi_id: string,
    @Query('jenis_peralatan_id') jenis_peralatan_id: string,
    @Query('bay_id') bay_id: string,
    @Query('page') page: number | undefined,
    @Query('perPage') perPage: number | undefined,
    // @Query('search') search: string,
  ) {
    // const sanitizedPage = Number.isNaN(page) ? 1 : page;
    // const sanitizedPerPage = Number.isNaN(perPage) ? 10 : perPage;

    const alat = await this.inventarisService.getAlat({
      ultg_id,
      gi_id,
      jenis_peralatan_id,
      bay_id,
      page,
      perPage,
      // search,
    });

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil ditemukan', alat);
  }

  @Get('alat/download')
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
  @Roles('ADMIN', 'GI', 'HAR')
  async unduhAlat(
    @Res() response: Response,
    @Query('awal') awal?: string,
    @Query('akhir') akhir?: string,
  ) {
    await this.inventarisService.unduhAlat({
      awal,
      akhir,
      response,
    });
  }

  @Get('alat/:alat_id')
  @Roles('ADMIN', 'GI', 'HAR')
  async getDetailAlat(@Param('alat_id') alat_id: string) {
    const alat = await this.inventarisService.getDetailAlat(alat_id);

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil ditemukan', alat);
  }

  @Patch('jenis/alat/:jenis_alat_id')
  @Roles('ADMIN', 'GI', 'HAR')
  async updateJenisAlat(
    @Param('jenis_alat_id') jenis_alat_id: string,
    @Body(ValidationPipe) data: UpdateJenisAlatDto,
  ) {
    const alat = await this.inventarisService.updateJenisAlat(
      jenis_alat_id,
      data,
    );

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil diperbarui', alat);
  }

  @Patch('alat/:alat_id')
  @Roles('ADMIN', 'GI', 'HAR')
  // @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('nameplate'))
  async updateAlat(
    @Param('alat_id') alat_id: string,
    @Body() data: UpdateAlatDto,
    @UploadedFile() nameplate: Express.Multer.File | null,
  ) {
    const alat = await this.inventarisService.updateAlat(
      alat_id,
      data,
      nameplate,
    );

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil diperbarui', alat);
  }
}

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

import {
  ErrorResponse,
  GetUser,
  JwtGuard,
  Roles,
  RolesGuard,
  SuccessResponse,
} from 'common';
import { FileInjector } from 'nestjs-file-upload';

import { CREATE_ALAT_BODY } from './decorators';
import { CreateAlatDto, CreateJenisAlatDto, UpdateJenisAlatDto } from './dto';
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
  @CREATE_ALAT_BODY()
  @FileInjector(CreateAlatDto)
  async createAlat(
    @Body(ValidationPipe) data: CreateAlatDto,
    @GetUser('id') user_id: string,
  ) {
    const alat = await this.inventarisService.createAlat(data, user_id);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Alat berhasil ditambahkan',
      alat,
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
  @Roles('ADMIN', 'GI', 'HAR')
  async getJenisAlat() {
    const alat = await this.inventarisService.getJenisAlat();

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
    name: 'search',
    required: false,
    type: String,
    description: 'Search',
  })
  @Roles('ADMIN', 'GI', 'HAR')
  async getAlat(
    @Query('ultg_id') ultg_id: string,
    @Query('gi_id') gi_id: string,
    @Query('jenis_peralatan_id') jenis_peralatan_id: string,
    @Query('bay_id') bay_id: string,
    @Query('search') search: string,
  ) {
    const alat = await this.inventarisService.getAlat({
      ultg_id,
      gi_id,
      jenis_peralatan_id,
      bay_id,
      search,
    });

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil ditemukan', alat);
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
  async updateAlat(
    @Param('alat_id') alat_id: string,
    @Body(ValidationPipe) data: UpdateJenisAlatDto,
  ) {
    const alat = await this.inventarisService.updateAlat(alat_id, data);

    return new SuccessResponse(HttpStatus.OK, 'Alat berhasil diperbarui', alat);
  }
}
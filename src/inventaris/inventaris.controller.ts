/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ErrorResponse,
  JwtGuard,
  Roles,
  RolesGuard,
  SuccessResponse,
} from 'common';
import { FileInjector } from 'nestjs-file-upload';

import { CREATE_ALAT_BODY } from './decorators';
import { CreateAlatDto, CreateJenisAlatDto } from './dto';
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
  async createAlat(@Body(ValidationPipe) data: CreateAlatDto) {
    const alat = await this.inventarisService.createAlat(data);

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
}

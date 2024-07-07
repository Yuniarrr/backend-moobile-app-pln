/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
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

import { CreateGIDto, CreateULTGDto, UpdateGIDto, UpdateULTGDto } from './dto';
import { ManagementService } from './management.service';

@ApiTags('management')
@Controller('management')
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
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('ultg')
  @Roles('ADMIN')
  async createUltg(@Body(ValidationPipe) data: CreateULTGDto) {
    const newUltg = await this.managementService.createUltg(data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'The record has been successfully created.',
      newUltg,
    );
  }

  @Post('gi')
  @Roles('ADMIN')
  async createGi(@Body(ValidationPipe) data: CreateGIDto) {
    const newGI = await this.managementService.createGi(data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'The record has been successfully created.',
      newGI,
    );
  }

  @Get('ultg/:ultg_id')
  @Roles('ADMIN', 'GI', 'HAR')
  async getDetailUltg(@Param('ultg_id') ultg_id: string) {
    const details = await this.managementService.getDetailUltg(ultg_id);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      details,
    );
  }

  @Patch('ultg/:ultg_id')
  @Roles('ADMIN')
  async updateUltg(
    @Param('ultg_id') ultg_id: string,
    @Body(ValidationPipe) data: UpdateULTGDto,
  ) {
    const update = await this.managementService.updateUltg(ultg_id, data);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      update,
    );
  }

  @Patch('gi/:gi_id')
  @Roles('ADMIN')
  async updateGI(
    @Param('gi_id') gi_id: string,
    @Body(ValidationPipe) data: UpdateGIDto,
  ) {
    const update = await this.managementService.updateGI(gi_id, data);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      update,
    );
  }
}

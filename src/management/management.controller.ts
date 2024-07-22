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
  BadRequestException,
  Query,
  Delete,
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

import { type Prisma, Role } from '@prisma/client';
import {
  ErrorResponse,
  JwtGuard,
  Roles,
  RolesGuard,
  SuccessResponse,
} from 'common';

import {
  CreateGIDto,
  CreateULTGDto,
  CreateUserDto,
  UpdateGIDto,
  UpdateULTGDto,
  UpdateUserDto,
} from './dto';
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

  @Post('user')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @Roles('ADMIN')
  async createUser(@Body(ValidationPipe) data: CreateUserDto) {
    if (data.gi_id && data.role !== 'GI') {
      throw new BadRequestException(
        'If you want to assign a GI, the role must be GI.',
      );
    }

    const newGI = await this.managementService.createUser(data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'The record has been successfully created.',
      newGI,
    );
  }

  @Get('user')
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    enum: [Role.ADMIN, Role.GI, Role.HAR],
    description: 'Role of the user',
  })
  @ApiQuery({
    name: 'ultg_id',
    required: false,
    type: String,
    description: 'Id of the ultg',
  })
  @ApiQuery({
    name: 'gi_id',
    required: false,
    type: String,
    description: 'Id of the gi',
  })
  @Roles('ADMIN')
  async getUsers(
    @Query('role') role: Role,
    @Query('ultg_id') ultg_id: string,
    @Query('gi_id') gi_id: string,
  ) {
    const where: Prisma.usersWhereInput = { role, gi_id, gi: { ultg_id } };

    const details = await this.managementService.getUsers(where);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      details,
    );
  }

  @Get('ultg')
  @ApiQuery({
    name: 'ultg_id',
    required: false,
    type: String,
    description: 'Id of the ultg',
  })
  @Roles('ADMIN', 'GI', 'HAR')
  async getUltg(@Query('ultg_id') ultg_id: string) {
    const details = await this.managementService.getUltg(ultg_id);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      details,
    );
  }

  @Get('bay')
  @ApiQuery({
    name: 'gi_id',
    required: false,
    type: String,
    description: 'Id of the gi',
  })
  @Roles('ADMIN', 'GI', 'HAR')
  async getListBay(@Query('gi_id') gi_id: string) {
    const details = await this.managementService.getListBay(gi_id);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      details,
    );
  }

  @Get('gi')
  @Roles('ADMIN', 'GI', 'HAR')
  async getGI() {
    const details = await this.managementService.getGI();

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      details,
    );
  }

  @Get('gi/:gi_id')
  @Roles('ADMIN', 'GI', 'HAR')
  async getDetailGI(@Param('gi_id') gi_id: string) {
    const details = await this.managementService.getDetailGI(gi_id);

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

  @Patch('user/:user_id')
  @Roles('ADMIN')
  async updateUser(
    @Param('user_id') user_id: string,
    @Body(ValidationPipe) data: UpdateUserDto,
  ) {
    const update = await this.managementService.updateUser(user_id, data);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully created.',
      update,
    );
  }

  @Delete('user/:user_id')
  @Roles('ADMIN')
  async deleteUser(@Param('user_id') user_id: string) {
    await this.managementService.deleteUser(user_id);

    return new SuccessResponse(
      HttpStatus.OK,
      'The record has been successfully deleted.',
    );
  }
}

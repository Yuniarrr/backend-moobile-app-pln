/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SuccessResponse } from 'common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
@ApiCreatedResponse({
  description: 'The record has been successfully created.',
  type: SuccessResponse,
})
@ApiOkResponse({
  description: 'The record has been successfully created.',
  type: SuccessResponse,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) data: RegisterDto) {
    const user = await this.authService.register(data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'User created successfully',
      user,
    );
  }

  @Post('login')
  async login(@Body(ValidationPipe) data: LoginDto) {
    const user = await this.authService.login(data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'User created successfully',
      user,
    );
  }
}

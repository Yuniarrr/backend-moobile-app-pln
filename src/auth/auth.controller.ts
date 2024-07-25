/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  GetUser,
  JwtGuard,
  NoCache,
  Roles,
  RolesGuard,
  SuccessResponse,
} from 'common';

import { AuthService } from './auth.service';
import {
  GantiPasswordDto,
  LoginDto,
  MeDto,
  RefreshTokenDto,
  RegisterDto,
} from './dto';

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
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
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

  @Post('refresh-token')
  async refreshToken(@Body(ValidationPipe) data: RefreshTokenDto) {
    const refresh_token = await this.authService.refreshToken(data);

    return new SuccessResponse(
      HttpStatus.OK,
      'Getting new access token',
      refresh_token,
    );
  }

  @Patch('ganti-password')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'GI', 'HAR')
  async gantiPassword(
    @Body(ValidationPipe) data: GantiPasswordDto,
    @GetUser('id') user_id: string,
  ) {
    await this.authService.gantiPassword(user_id, data);

    return new SuccessResponse(
      HttpStatus.CREATED,
      'Password changed successfully',
    );
  }

  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'GI', 'HAR')
  async logout(@GetUser('id') user_id: string) {
    await this.authService.logout(user_id);

    return new SuccessResponse(HttpStatus.OK, 'User logged out successfully');
  }

  @Post('me')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'GI', 'HAR')
  @NoCache()
  async userMe(@Body(ValidationPipe) data: MeDto) {
    const user = await this.authService.userMe(data.user_id);

    return new SuccessResponse(
      HttpStatus.OK,
      'User data retrieved successfully',
      user,
    );
  }

  @Get('health-check')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'GI', 'HAR')
  @NoCache()
  healthCheck(@GetUser('id') user_id: string) {
    return new SuccessResponse(
      HttpStatus.OK,
      'User data retrieved successfully',
      user_id,
    );
  }
}

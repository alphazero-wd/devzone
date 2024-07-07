import { Request } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { CookieAuthGuard, LocalAuthGuard } from './guards';
import { CurrentUser } from '../users/decorators';
import { User } from '@prisma/client';
import { TransformDataInterceptor } from '../common/interceptors';
import { AuthResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(new TransformDataInterceptor(AuthResponse))
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.register(createUserDto);
    return newUser;
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformDataInterceptor(AuthResponse))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@CurrentUser() user: User) {
    return user;
  }

  @Get('me')
  @UseGuards(CookieAuthGuard)
  @UseInterceptors(new TransformDataInterceptor(AuthResponse))
  me(@CurrentUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(CookieAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    req.logOut(() => {});
    req.session.cookie.maxAge = 0;
  }
}

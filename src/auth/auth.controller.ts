import {
  BadRequestException,
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
import { User } from '@prisma/client';
import { Request } from 'express';
import { TransformDataInterceptor } from '../common/interceptors';
import { CurrentUser } from '../users/decorators';
import { CreateUserDto } from '../users/dto';
import { AuthService } from './auth.service';
import { ConfirmEmailDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { CookieAuthGuard, LocalAuthGuard } from './guards';
import { AuthResponse } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(new TransformDataInterceptor(AuthResponse))
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.register(createUserDto);
    await this.authService.sendConfirmationEmail(newUser);
    return newUser;
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(new TransformDataInterceptor(AuthResponse))
  @Post('confirm-email')
  async confirmEmail(
    @CurrentUser() user: User,
    @Body() { token }: ConfirmEmailDto,
  ) {
    if (user.confirmedAt)
      throw new BadRequestException('You have already confirmed your email');
    await this.authService.confirmEmail(user.id, token);
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(new TransformDataInterceptor(AuthResponse))
  @Post('resend-confirmation')
  async resendConfirmEmail(@CurrentUser() user: User) {
    if (user.confirmedAt)
      throw new BadRequestException('You have already confirmed your email');
    await this.authService.sendConfirmationEmail(user);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('forgot-password')
  async handleForgotPassword(@Body() { email }: ForgotPasswordDto) {
    await this.authService.handleForgotPassword(email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async handleResetPassword(@Body() { password, token }: ResetPasswordDto) {
    await this.authService.handleResetPassword(token, password);
  }
}

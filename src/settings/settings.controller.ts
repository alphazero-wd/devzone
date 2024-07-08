import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CookieAuthGuard } from '../auth/guards';
import { CurrentUser } from '../users/decorators';
import { User } from '@prisma/client';
import { ConfirmEmailDto } from '../auth/dto';
import { UpdateEmailDto, UpdateNameDto, UpdatePasswordDto } from './dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('profile/name')
  async changeName(@CurrentUser() user: User, @Body() { name }: UpdateNameDto) {
    await this.settingsService.updateName(user.id, name);
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('account/password')
  async changePassword(
    @CurrentUser() user: User,
    @Body() { password, newPassword }: UpdatePasswordDto,
  ) {
    await this.settingsService.updatePassword(user, password, newPassword);
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('account/delete')
  async deleteAccount(@CurrentUser() user: User) {
    await this.settingsService.deleteAccount(user.id);
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('account/email')
  async changeEmail(
    @CurrentUser() user: User,
    @Body() { email }: UpdateEmailDto,
  ) {
    await this.settingsService.initEmailChangeConfirmation(user, email);
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('confirm/old-email')
  async confirmOldEmail(
    @CurrentUser() user: User,
    @Body() { token }: ConfirmEmailDto,
  ) {
    await this.settingsService.confirmEmailToken(user, token, 'oldEmailToken');
  }

  @UseGuards(CookieAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('confirm/new-email')
  async confirmNewEmail(
    @CurrentUser() user: User,
    @Body() { token }: ConfirmEmailDto,
  ) {
    await this.settingsService.confirmEmailToken(user, token, 'newEmailToken');
  }
}

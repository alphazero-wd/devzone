import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CookieAuthGuard, EmailConfirmAuthGuard } from '../auth/guards';
import { CurrentUser } from '../users/decorators';
import { User } from '@prisma/client';
import { ConfirmEmailDto } from '../auth/dto';
import { UpdateEmailDto, UpdateNameDto, UpdatePasswordDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UserWithAvatar } from '../users/types';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_AVATAR_FILE_SIZE,
} from '../common/constants';

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

  @UseGuards(EmailConfirmAuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('profile/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_AVATAR_FILE_SIZE }),
          new FileTypeValidator({ fileType: ALLOWED_IMAGE_MIME_TYPES }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @CurrentUser() user: UserWithAvatar,
  ) {
    await this.settingsService.updateAvatar(user, {
      filename: avatar.filename,
      buffer: avatar.buffer,
    });
  }

  @UseGuards(EmailConfirmAuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profile/avatar/remove')
  async removeAvatar(@CurrentUser() user: UserWithAvatar) {
    await this.settingsService.deleteAvatar(user);
  }
}

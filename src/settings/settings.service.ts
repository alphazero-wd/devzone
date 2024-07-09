import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { User } from '@prisma/client';
import { v4 } from 'uuid';
import * as argon2 from 'argon2';
import { UploadFileDto } from '../storage/dto';
import { UserWithAvatar } from '../users/types';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class SettingsService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private storageService: StorageService,
  ) {}

  async updateName(userId: number, newName: string) {
    const updatedUser = await this.usersService.update(userId, {
      name: newName,
    });
    return updatedUser;
  }

  async updateAvatar(user: UserWithAvatar, uploadAvatarDto: UploadFileDto) {
    if (user.avatarId) await this.storageService.remove([user.avatar.key]);
    const [result] = await this.storageService.create([uploadAvatarDto]);
    const { id } = await this.storageService.findOne(result.Key);
    await this.usersService.update(user.id, { avatarId: id });
  }

  async deleteAvatar(user: UserWithAvatar) {
    if (!user.avatar)
      throw new BadRequestException("You haven't uploaded an avatar");
    await this.storageService.remove([user.avatar.key]);
  }

  async updatePassword(user: User, password: string, newPassword: string) {
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword)
      throw new BadRequestException('Incorrect password provided');
    const hashedPassword = await argon2.hash(newPassword);
    await this.usersService.update(user.id, {
      password: hashedPassword,
    });
  }

  async deleteAccount(userId: number) {
    await this.usersService.remove(userId);
  }

  async confirmEmailToken(
    user: User,
    token: string,
    emailTypeToken: 'oldEmailToken' | 'newEmailToken',
  ) {
    if (user[emailTypeToken] !== token)
      throw new BadRequestException('Invalid token provided');
    const updatedUser = await this.usersService.update(user.id, {
      [emailTypeToken]: null,
    });
    if (!updatedUser.oldEmailToken && !updatedUser.newEmailToken)
      await this.usersService.update(user.id, { email: user.newEmail });
  }

  async initEmailChangeConfirmation(user: User, newEmail: string) {
    if (user.email === newEmail) return;
    const existingUser = await this.usersService.findByEmail(newEmail);
    if (existingUser) throw new BadRequestException('Email already exists');
    const oldEmailToken = v4();
    const newEmailToken = v4();
    await this.usersService.update(user.id, {
      oldEmailToken,
      newEmailToken,
      newEmail,
    });
    await this.mailService.sendChangeEmailConfirmation(
      user.email,
      user.name,
      oldEmailToken,
    );
    await this.mailService.sendChangeEmailConfirmation(
      newEmail,
      user.name,
      newEmailToken,
    );
  }
}

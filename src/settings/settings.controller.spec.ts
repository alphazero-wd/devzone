import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEmailDto, UpdateNameDto, UpdatePasswordDto } from './dto';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { User } from '@prisma/client';
import { userFixture } from '../users/test-utils';
import { ConfirmEmailDto } from '../auth/dto';
import { UserWithAvatar } from '../users/types';

describe('SettingsController', () => {
  let settingsController: SettingsController;
  let settingsService: SettingsService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {
            updateName: jest.fn(),
            updatePassword: jest.fn(),
            deleteAccount: jest.fn(),
            initEmailChangeConfirmation: jest.fn(),
            confirmEmailToken: jest.fn(),
            updateAvatar: jest.fn(),
            deleteAvatar: jest.fn(),
          },
        },
      ],
    }).compile();

    settingsController = module.get<SettingsController>(SettingsController);
    settingsService = module.get<SettingsService>(SettingsService);
    user = userFixture();
  });

  describe('changeName', () => {
    it('should change the user name', async () => {
      const updateNameDto: UpdateNameDto = { name: 'New Name' };

      await settingsController.changeName(user, updateNameDto);

      expect(settingsService.updateName).toHaveBeenCalledWith(
        user.id,
        updateNameDto.name,
      );
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      const updatePasswordDto: UpdatePasswordDto = {
        password: 'oldPassword',
        newPassword: 'newPassword',
      };

      await settingsController.changePassword(user, updatePasswordDto);

      expect(settingsService.updatePassword).toHaveBeenCalledWith(
        user,
        updatePasswordDto.password,
        updatePasswordDto.newPassword,
      );
    });
  });

  describe('deleteAccount', () => {
    it('should delete the user account', async () => {
      const user: User = { id: 1 } as User;

      await settingsController.deleteAccount(user);

      expect(settingsService.deleteAccount).toHaveBeenCalledWith(user.id);
    });
  });

  describe('changeEmail', () => {
    it('should initiate email change confirmation', async () => {
      const updateEmailDto: UpdateEmailDto = { email: 'new@example.com' };

      await settingsController.changeEmail(user, updateEmailDto);

      expect(settingsService.initEmailChangeConfirmation).toHaveBeenCalledWith(
        user,
        updateEmailDto.email,
      );
    });
  });

  describe('confirmOldEmail', () => {
    it('should confirm old email token', async () => {
      const confirmEmailDto: ConfirmEmailDto = { token: 'old-token' };

      await settingsController.confirmOldEmail(user, confirmEmailDto);

      expect(settingsService.confirmEmailToken).toHaveBeenCalledWith(
        user,
        confirmEmailDto.token,
        'oldEmailToken',
      );
    });
  });

  describe('confirmNewEmail', () => {
    it('should confirm new email token', async () => {
      const confirmEmailDto: ConfirmEmailDto = { token: 'new-token' };

      await settingsController.confirmNewEmail(user, confirmEmailDto);

      expect(settingsService.confirmEmailToken).toHaveBeenCalledWith(
        user,
        confirmEmailDto.token,
        'newEmailToken',
      );
    });
  });

  describe('uploadAvatar', () => {
    it('should update the user avatar', async () => {
      const user = userFixture({
        avatarId: 2,
        avatar: { id: 2, url: '', key: 'old-avatar-key' },
      });
      const file = {
        filename: 'avatar.png',
        buffer: Buffer.from('avatar'),
      } as Express.Multer.File;

      await settingsController.uploadAvatar(file, user);

      expect(settingsService.updateAvatar).toHaveBeenCalledWith(user, {
        filename: file.filename,
        buffer: file.buffer,
      });
    });
  });

  describe('removeAvatar', () => {
    it('should remove the user avatar', async () => {
      const user = userFixture({
        avatarId: 2,
        avatar: { id: 2, url: '', key: 'old-avatar-key' },
      });

      await settingsController.removeAvatar(user);

      expect(settingsService.deleteAvatar).toHaveBeenCalledWith(user);
    });
  });
});

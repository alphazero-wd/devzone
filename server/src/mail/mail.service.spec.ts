import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { userFixture } from '../users/test-utils';
import { User } from '@prisma/client';
import { MOCK_TOKEN } from '../common/constants';
import { ConfigService } from '@nestjs/config';

jest.mock('uuid', () => ({
  v4: () => MOCK_TOKEN,
}));

const CORS_ORIGIN = 'https://example.com';

describe('MailService', () => {
  let service: MailService;
  let mailer: MailerService;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: { sendMail: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: () => CORS_ORIGIN },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailer = module.get<MailerService>(MailerService);
    user = userFixture();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendResetPassword', () => {
    it('should send reset password to the right recipient with correct payload', async () => {
      const url = `${CORS_ORIGIN}/auth/password/reset?token=${MOCK_TOKEN}`;
      await service.sendResetPassword(user.email, user.name, MOCK_TOKEN);
      expect(mailer.sendMail).toHaveBeenCalledWith({
        to: user.email,
        subject: 'Reset Password Request',
        template: './reset-password',
        context: { name: user.name, url },
      });
    });
  });

  describe('sendConfirmationEmail', () => {
    it('should send confirmation email to the right recipient with correct payload', async () => {
      const url = `${CORS_ORIGIN}/confirm/account?token=${MOCK_TOKEN}`;
      await service.sendConfirmationEmail(user.email, user.name, MOCK_TOKEN);
      expect(mailer.sendMail).toHaveBeenCalledWith({
        to: user.email,
        subject: 'Confirm your email account',
        template: './confirm-email',
        context: { name: user.name, url },
      });
    });
  });

  describe('sendChangeEmailConfirmation', () => {
    it('should send email change confirmation to the right recipient with correct payload', async () => {
      const url = `${CORS_ORIGIN}/confirm/email-change?token=${MOCK_TOKEN}`;
      await service.sendChangeEmailConfirmation(
        user.email,
        user.name,
        MOCK_TOKEN,
      );
      expect(mailer.sendMail).toHaveBeenCalledWith({
        to: user.email,
        subject: 'Confirm email change',
        template: './change-email',
        context: { name: user.name, url },
      });
    });
  });
});

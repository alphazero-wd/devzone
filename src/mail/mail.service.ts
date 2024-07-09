import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendResetPassword(to: string, name: string, token: string) {
    const url = `${this.configService.get('CORS_ORIGIN')}/auth/password/reset?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Reset Password Request',
      template: './reset-password',
      context: { name, url },
    });
  }

  async sendConfirmationEmail(to: string, name: string, token: string) {
    const url = `${this.configService.get('CORS_ORIGIN')}/confirm-email?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Confirm your email account',
      template: './confirm-email',
      context: { name, url },
    });
  }
  async sendChangeEmailConfirmation(to: string, name: string, token: string) {
    const url = `${this.configService.get('CORS_ORIGIN')}/change-email/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Confirm email change',
      template: './change-email',
      context: { name, url },
    });
  }
}

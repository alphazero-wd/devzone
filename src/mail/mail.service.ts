import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendResetPassword(user: User, token: string) {
    const url = `${this.configService.get('CORS_ORIGIN')}/auth/password/reset?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password Request',
      template: './reset-password',
      context: { name: user.name, url },
    });
  }
}

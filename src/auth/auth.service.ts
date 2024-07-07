import * as argon2 from 'argon2';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';
import { MailService } from '../mail/mail.service';
import { v4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FORGOT_PASSWORD_KEY_PREFIX } from '../common/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async register({ password, ...createUserDto }: CreateUserDto) {
    const hashedPassword = await argon2.hash(password);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async handleForgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    const token = v4();
    await this.cacheService.set(
      `${FORGOT_PASSWORD_KEY_PREFIX}-${token}`,
      user.id,
      1000 * 60 * 15,
    );
    await this.mailService.sendResetPassword(user, token);
  }

  async handleResetPassword(token: string, newPassword: string) {
    const userId = await this.validateToken(token);
    const hashedPassword = await argon2.hash(newPassword);
    await this.cacheService.del(`${FORGOT_PASSWORD_KEY_PREFIX}-${token}`);
    await this.usersService.update(userId, { password: hashedPassword });
  }

  private async validateToken(token: string) {
    const userId = await this.cacheService.get<number>(
      `${FORGOT_PASSWORD_KEY_PREFIX}-${token}`,
    );
    if (!userId) throw new BadRequestException('Invalid token');
    return userId;
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(user.password, password);
      return user;
    } catch (error) {
      if (error instanceof BadRequestException)
        throw new BadRequestException('Wrong email or password provided');
      else throw new InternalServerErrorException(error.message);
    }
  }

  private async verifyPassword(hashed: string, plain: string) {
    const isCorrectPassword = await argon2.verify(hashed, plain);
    if (!isCorrectPassword) throw new BadRequestException();
  }
}

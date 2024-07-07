import * as argon2 from 'argon2';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register({ password, ...createUserDto }: CreateUserDto) {
    const hashedPassword = await argon2.hash(password);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(user.password, password);
      return user;
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      // for security reasons
      throw new BadRequestException('Wrong email or password provided');
    }
  }

  private async verifyPassword(hashed: string, plain: string) {
    const isCorrectPassword = await argon2.verify(hashed, plain);
    if (!isCorrectPassword) throw new BadRequestException();
  }
}

import { PickType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateUserDto } from '../../users/dto';

export class ResetPasswordDto extends PickType(CreateUserDto, ['password']) {
  @IsUUID()
  token: string;
}

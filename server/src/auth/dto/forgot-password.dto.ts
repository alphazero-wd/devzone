import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto';

export class ForgotPasswordDto extends PickType(CreateUserDto, ['email']) {}

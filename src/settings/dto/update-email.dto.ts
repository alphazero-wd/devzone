import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto';

export class UpdateEmailDto extends PickType(CreateUserDto, ['email']) {}

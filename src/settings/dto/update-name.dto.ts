import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto';

export class UpdateNameDto extends PickType(CreateUserDto, ['name']) {}

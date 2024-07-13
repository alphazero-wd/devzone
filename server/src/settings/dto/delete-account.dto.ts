import { PickType } from '@nestjs/mapped-types';
import { UpdatePasswordDto } from './update-password.dto';

export class DeleteAccountDto extends PickType(UpdatePasswordDto, [
  'password',
]) {}

import { PickType } from '@nestjs/mapped-types';
import { ResetPasswordDto } from './reset-password.dto';

export class ConfirmEmailDto extends PickType(ResetPasswordDto, ['token']) {}

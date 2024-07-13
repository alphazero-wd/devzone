import { IsIn } from 'class-validator';
import { ConfirmEmailDto } from '../../auth/dto';

export class ConfirmEmailChangeDto extends ConfirmEmailDto {
  @IsIn(['old', 'new'])
  emailType: 'old' | 'new';
}

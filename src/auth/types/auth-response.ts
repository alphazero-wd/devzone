import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AuthResponse implements User {
  id: number;
  name: string;
  email: string;

  @Exclude()
  confirmedAt: Date | null;

  @Exclude()
  newEmail: string | null;

  @Exclude()
  password: string;
  createdAt: Date;

  @Exclude()
  newEmailToken: string | null;
  @Exclude()
  oldEmailToken: string | null;
}

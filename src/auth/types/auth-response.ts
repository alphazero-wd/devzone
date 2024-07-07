import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AuthResponse implements User {
  id: number;
  name: string;
  @Exclude()
  email: string;
  @Exclude()
  password: string;
  createdAt: Date;
}

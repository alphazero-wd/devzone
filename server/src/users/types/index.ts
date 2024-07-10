import { File, User } from '@prisma/client';

export interface UserWithAvatar extends User {
  avatar?: File;
}

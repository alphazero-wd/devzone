import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Type,
  mixin,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CookieAuthGuard } from './cookie-auth.guard';

export const EmailConfirmAuthGuard = (): Type<CanActivate> => {
  class EmailConfirmAuthGuardMixin extends CookieAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user: User = request.user;

      if (!user.confirmedAt)
        throw new ForbiddenException({
          success: false,
          message: 'Email not confirmed',
        });
      return true;
    }
  }

  return mixin(EmailConfirmAuthGuardMixin);
};

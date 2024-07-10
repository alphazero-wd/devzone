import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated())
      throw new UnauthorizedException({
        success: false,
        message: 'You are not logged in to perform the action',
      });

    return true;
  }
}

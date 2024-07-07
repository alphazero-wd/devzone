import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // check the email and the password
      await super.canActivate(context);

      // initialize the session
      const request: Request = context.switchToHttp().getRequest();
      await super.logIn(request);

      // if no exceptions were thrown, allow the access to the route
      return true;
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'Wrong email or password provided',
      });
    }
  }
}

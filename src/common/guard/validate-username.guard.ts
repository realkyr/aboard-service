import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateUsernameGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const username = request.headers['username'];

    if (!username) {
      throw new BadRequestException('Username header is missing');
    }

    request['username'] = username;
    return true; // Allow the request to proceed
  }
}

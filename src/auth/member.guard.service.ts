import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { Payload } from 'type/jwt.payload';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<boolean>('member', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    if (!authorization) throw new ForbiddenException('Unauthorized');

    const token = authorization && authorization.split(' ')[1];
    const user: Payload = this.validateToken(token);
    if (!user.isMember) throw new ForbiddenException('Unauthorized');

    return true;
  }

  validateToken(token: string) {
    const secretKey = process.env.JWT_SECRET_KEY;

    try {
      return this.jwtService.verify(token, { secret: secretKey });
    } catch (e) {
      switch (e.name) {
        case 'JsonWebTokenError':
          throw new UnauthorizedException('Unauthorized Token');

        case 'TokenExpiredError':
          throw new UnauthorizedException('Expired Token');

        default:
          throw new HttpException('Server Error', 500);
      }
    }
  }
}

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (request.user === undefined) throw new UnauthorizedException('로그인이 필요합니다.');

  return request.user;
});

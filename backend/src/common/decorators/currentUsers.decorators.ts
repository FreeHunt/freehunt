import { createParamDecorator } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    return request.user;
  },
);

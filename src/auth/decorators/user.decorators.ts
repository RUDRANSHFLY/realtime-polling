import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface User {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export const getUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();

    const user = request.user as User | undefined;

    if (!user) {
      throw new Error('User not found in the request');
    }

    return data ? user[data] : user;
  },
);

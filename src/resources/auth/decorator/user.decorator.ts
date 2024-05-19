import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/resources/user/entity/user.entity';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext):Promise<User> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
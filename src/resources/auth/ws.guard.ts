import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {

    constructor(
        private authService: AuthService
    ) { }


    async canActivate(context: ExecutionContext): Promise<any> {
        try {
            if (context.getType() !== 'ws') {
                return true;
            }

            const client = context.switchToWs().getClient<Socket>();
            const { authorization } = client.handshake.headers;
            console.log("authorization", authorization)
            const payload = await this.authService.validateToken(authorization)

            console.log({ payload });
            context.switchToWs().getData().user = payload;
            return payload;
        } catch (error) {
            console.log('auth error - ', error.message);
            throw new ForbiddenException(error.message || 'session expired! Please sign In');
        }
    }
}
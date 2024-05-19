import { Socket } from 'socket.io';
import { WSAuthService } from './service/ws-auth.service';

type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (
    wsAuthService: WSAuthService
): SocketIOMiddleWare => {
  return (client, next) => {
    try {
      const { authorization } = client.handshake.headers;
      wsAuthService.isValidAuthHeader(authorization);
      next();
    } catch (error) {
      next(error);
    }
  };
};
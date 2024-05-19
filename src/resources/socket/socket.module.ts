import { Module, Global } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';

@Global()
@Module({
    controllers: [],
    providers: [WebsocketsGateway],
    exports: [WebsocketsGateway],
})
export class SocketModule {}
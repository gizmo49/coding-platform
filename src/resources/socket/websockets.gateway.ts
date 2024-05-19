import { SubscribeMessage, WebSocketGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Task } from '../task/entity/task.entity';
import { EventType, NewTaskEvent } from './enums/events';
import { Injectable, UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/ws.guard';
import { SocketAuthMiddleware } from '../auth/ws.middleware';
import { WSAuthService } from '../auth/service/ws-auth.service';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WsGuard)
@Injectable()
export class WebsocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private wsAuthService: WSAuthService
) { }
  private clients: Set<Socket> = new Set();

  @WebSocketServer() server: Server;

  afterInit(client: Socket) {
    console.log('WebSocket Gateway initialized');
    client.use(SocketAuthMiddleware(this.wsAuthService) as any); // because types are broken
  }


  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.add(client);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {
    console.log("client", client)
    console.log(`Message from client ${client.id}: ${payload}`);
    this.server.emit('messageToClient',payload);
  }

  triggerNewTaskEvent(task: Task) {
    const payload: NewTaskEvent = {
      eventType: EventType.NEW_TASK,
      payload: task,
    };
    this.server.emit(EventType.NEW_TASK, payload);
  }

}
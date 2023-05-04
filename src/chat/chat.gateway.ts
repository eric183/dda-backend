import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';

import { Injectable, Logger } from '@nestjs/common';

import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

type T2UserType = {
  id: string;
  message: string;
};

interface IRequest {
  fromUser: T2UserType;
  toUser: T2UserType;
  message: string;
}

@Injectable()
@WebSocketGateway(8081, { cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  toUser: T2UserType = {
    id: '',
    message: '',
  };

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  async afterInit() {
    this.logger.verbose('Initialized');
  }

  async handleConnection(client: Socket) {
    console.log(client, '...!!!');
  }

  @SubscribeMessage('startChat')
  startChat(
    @MessageBody()
    { fromUser, toUser }: IRequest,
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.joinChat(fromUser.id, this.toUser.id, client);
  }

  @SubscribeMessage('joinChat')
  joinChat(
    @MessageBody()
    { fromUser, toUser }: IRequest,
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.joinChat(fromUser.id, this.toUser.id, client);
  }

  @SubscribeMessage('sendMessage')
  sendMessage(
    @MessageBody()
    { fromUser, toUser, message }: IRequest,
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.sendMessage(fromUser.id, this.toUser.id, message, client);
  }

  async handleDisconnect(
    @MessageBody()
    { fromUser, toUser }: IRequest,
  ) {
    this.chatService.leaveChat(fromUser.id, this.toUser.id);
  }
}

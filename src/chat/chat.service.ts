import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

// @UseGuards(AuthGuard)
@Injectable()
export class ChatService {
  // 用户id到socket实例的映射
  private userSocketMap = new Map<
    string,
    {
      socket?: Socket;
      offlineMessages: any[];
    }
  >();
  server: any;

  async setUserSocket(id: string, socket: Socket) {
    const socketMap = this.userSocketMap.get(id);
    this.userSocketMap.set(id, {
      socket,
      offlineMessages:
        socketMap && socketMap?.offlineMessages
          ? socketMap.offlineMessages
          : [],
    });
  }

  async helpToUserCreateSocketMap(userId: string) {}

  async getUserSocket(id: string) {
    return this.userSocketMap.get(id);
  }
  /**
   * 用户A发起聊天
   * @param fromUserId 发起聊天的用户id
   * @param toUserId 接受聊天的用户id
   * @param message 发起聊天请求 message
   * @param demandId 发起聊天请求 message
   * @param type: "demand" | "normal" 发起聊天请求 message
   */
  async startChat({ fromUserId, toUserId, message, demandId, type }) {
    // this.helpToUserCreateSocketMap(toUserId);
    const toUserSocket = this.userSocketMap.get(toUserId);
    console.log(fromUserId, toUserId, !!toUserSocket);
    if (toUserSocket && toUserSocket.socket) {
      // 接收方在线，向接收方发起聊天请求
      toUserSocket.socket.emit('startChat', {
        fromUserId,
        message,
        demandId,
        type,
      });
    } else {
      // console.log('离线');
      // 接收方离线，存储聊天请求并等待接收方上线
      // 此处可以根据实际业务需求拓展，比如将请求存储到数据库中
    }
  }

  /**
   * 用户B加入聊天
   * @param fromUserId 发起聊天的用户id
   * @param toUserId 接受聊天的用户id
   * @param client 用户B的socket实例
   */
  async joinChat(fromUserId: string, toUserId: string, client: Socket) {
    // 将用户id和socket实例建立映射关系
    this.setUserSocket(fromUserId, client);
    client.join(`${fromUserId}-${toUserId}`);
  }

  /**
   * 用户离开聊天室
   * @param fromUserId 发起聊天的用户id
   * @param toUserId 接受聊天的用户id
   */
  async leaveChat(fromUserId: string, toUserId: string) {
    this.userSocketMap.delete(fromUserId);
    this.server.to(`${fromUserId}-${toUserId}`).emit('leaveChat', fromUserId);
  }

  /**
   * 发送消息
   * @param fromUserId 发送消息的用户id
   * @param toUserId 接受消息的用户id
   * @param message 消息内容
   */
  async sendMessage(fromUserId: string, toUserId: string, message: string) {
    // 待优化: 未上线用户逻辑

    const targetClient = this.userSocketMap.get(toUserId);
    if (!targetClient) {
      this.userSocketMap.set(toUserId, {
        offlineMessages: [
          {
            fromUserId,
            message,
          },
        ],
      });
      return;
    }

    targetClient?.socket?.emit('receiveMessage', {
      fromUserId,
      toUserId,
      message,
    });
    // this.server
    //   .to(`${fromUserId}-${toUserId}`)
    //   .emit('receiveMessage', { fromUserId, message });
    // client
    //   .to(`${fromUserId}-${toUserId}`)
    //   .emit('receiveMessage', { fromUserId, message });
  }
}

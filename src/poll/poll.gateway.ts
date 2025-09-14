/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  id: string;
  email: string;
}

@WebSocketGateway({ cors: true })
export class PollGateway implements OnGatewayConnection {
  constructor(private readonly config: ConfigService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string | undefined) ||
      (client.handshake.query?.token as string | undefined);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(
        token,
        this.config.get<string>('JWT_SECRET') || 'secret',
      ) as JwtPayload;

      client.data.user = payload;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('watchPoll')
  handleWatchPoll(client: Socket, pollId: string) {
    void client.join(`poll:${pollId}`);
  }

  broadCastVoteUpdate(pollId: string, counts: any[]) {
    this.server.to(`poll:${pollId}`).emit('voteUpdate', { pollId, counts });
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PollController } from './poll/poll.controller';
import { PollModule } from './poll/poll.module';
import { VoteController } from './vote/vote.controller';
import { VoteService } from './vote/vote.service';
import { VoteModule } from './vote/vote.module';
import { PollService } from './poll/poll.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AuthModule,
    UserModule,
    PollModule,
    VoteModule,
  ],
  controllers: [AppController, PollController, VoteController],
  providers: [AppService, UserService, VoteService, PollService],
})
export class AppModule {}

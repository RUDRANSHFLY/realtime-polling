import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { PollModule } from 'src/poll/poll.module';

@Module({
  imports: [PollModule],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}

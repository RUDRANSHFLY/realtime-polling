import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';

@Module({
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}

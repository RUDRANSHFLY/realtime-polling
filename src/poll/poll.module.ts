import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { PollGateway } from './poll.gateway';

@Module({
  controllers: [PollController],
  providers: [PollService, PollGateway],
  exports: [PollGateway],
})
export class PollModule {}

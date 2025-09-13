import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PollService } from './poll.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PollCreateDTO } from './dto';
import { getUser } from 'src/auth/decorators';

@UseGuards(AuthGuard)
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  createPoll(@Body() dto: PollCreateDTO, @getUser('sub') userId: string) {
    return this.pollService.createPoll(dto, userId);
  }

  @Get()
  getPolls(@Query('page') page: number, @Query('limit') limit: number) {
    return this.pollService.getPolls(page, limit);
  }
}

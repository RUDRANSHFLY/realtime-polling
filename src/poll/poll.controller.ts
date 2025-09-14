import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Get('me')
  getMinePolls(
    @getUser('sub') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.pollService.getMinePolls(userId, page, limit);
  }

  @Patch(':id/publish')
  publishPoll(@Param('id') pollId: string, @getUser('sub') userId: string) {
    return this.pollService.publishPoll(pollId, userId);
  }
}

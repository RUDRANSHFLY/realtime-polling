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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @ApiOperation({
    summary: 'Create A poll with options',
    description:
      'create a poll with questions and bunch of options and is published parameters',
  })
  @Post()
  createPoll(@Body() dto: PollCreateDTO, @getUser('sub') userId: string) {
    return this.pollService.createPoll(dto, userId);
  }

  @ApiOperation({
    summary: 'Get all polls which are published',
    description: 'returns a list of all polls with polloptions',
  })
  @Get()
  getPolls(@Query('page') page: number, @Query('limit') limit: number) {
    return this.pollService.getPolls(page, limit);
  }

  @ApiOperation({
    summary: 'Get all polls created by user',
    description:
      'Get all the polls created by the user published and non published',
  })
  @Get('me')
  getMinePolls(
    @getUser('sub') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.pollService.getMinePolls(userId, page, limit);
  }

  @ApiOperation({
    summary: 'Make a poll published',
    description: 'make a poll published but only by user created it',
  })
  @Patch(':id/publish')
  publishPoll(@Param('id') pollId: string, @getUser('sub') userId: string) {
    return this.pollService.publishPoll(pollId, userId);
  }
}

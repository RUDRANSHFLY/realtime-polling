import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteCreateDTO } from './dto';
import { getUser } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({
    summary: 'make a vote on post',
    description: 'a user can vote on single time on one post',
  })
  @Post()
  addVote(@Body() dto: VoteCreateDTO, @getUser('sub') userId: string) {
    return this.voteService.addVote(dto, userId);
  }
}

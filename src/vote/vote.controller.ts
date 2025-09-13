import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteCreateDTO } from './dto';
import { getUser } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  addVote(@Body() dto: VoteCreateDTO, @getUser('sub') userId: string) {
    return this.voteService.addVote(dto, userId);
  }
}

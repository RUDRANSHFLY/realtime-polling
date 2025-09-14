import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { VoteCreateDTO } from './dto';
import { Prisma } from 'generated/prisma';
import { PollGateway } from 'src/poll/poll.gateway';

@Injectable()
export class VoteService {
  constructor(
    private readonly prisma: DbService,
    private readonly gateway: PollGateway,
  ) {}

  async addVote(dto: VoteCreateDTO, userId: string) {
    try {
      const pollExist = await this.prisma.poll.findUnique({
        where: {
          id: dto.pollId,
        },
      });

      if (!pollExist) {
        throw new NotFoundException('Poll does not exist!');
      }

      if (!pollExist.isPublished) {
        throw new NotFoundException('Poll is not published yet!');
      }

      const pollOptionExist = await this.prisma.pollOption.findUnique({
        where: {
          id: dto.optionId,
        },
        select: {
          pollId: true,
        },
      });

      // Checking Polls incoorect option pass
      if (dto.pollId !== pollOptionExist?.pollId) {
        throw new BadRequestException(
          'The provided option does not belong to the specified poll',
        );
      }

      const vote = await this.prisma.vote.create({
        data: {
          userId: userId,
          pollId: dto.pollId,
          optionId: dto.optionId,
        },
      });

      const pollOptionsVotes = await this.prisma.pollOption.findMany({
        where: {
          pollId: dto.pollId,
        },
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
      });

      const counts = pollOptionsVotes.map((o) => ({
        id: o.id,
        text: o.text,
        voteCount: o._count.votes,
      }));

      this.gateway.broadCastVoteUpdate(dto.pollId, counts);

      return {
        message: 'Vote added to poll',
        id: vote.id,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException('already been voted to provided poll');
        }
      }
      console.error(`Error adding vote to poll ${err}`);
      throw err;
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { VoteCreateDTO } from './dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class VoteService {
  constructor(private readonly prisma: DbService) {}

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

      return vote;
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

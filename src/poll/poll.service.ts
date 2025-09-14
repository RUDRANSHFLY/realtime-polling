import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { PollCreateDTO, PollCreateResponseDTO, PollResponseDTO } from './dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class PollService {
  constructor(private readonly prisma: DbService) {}

  async createPoll(
    dto: PollCreateDTO,
    userId: string,
  ): Promise<PollCreateResponseDTO> {
    try {
      const poll = await this.prisma.poll.create({
        data: {
          question: dto.question,
          isPublished: dto.isPublished,
          creatorId: userId,
          options: {
            create: dto.options.map((option) => ({
              text: option,
            })),
          },
        },
      });

      const message = 'Poll created successfully';
      const pollRes = new PollCreateResponseDTO({
        message: message,
        id: poll.id,
      });

      return pollRes;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            'Poll already exist with same question added by u',
          );
        }
      }
      console.error(`Error creating in poll : ${err}`);
      throw err;
    }
  }

  async getPolls(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const polls = await this.prisma.poll.findMany({
        take: limit,
        skip: skip,
        where: {
          isPublished: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          options: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      });

      const message = 'Successfully retrieved polls';

      const pollRes = new PollResponseDTO({
        message: message,
        total: polls.length,
        page: page,
        limit: limit,
        polls: polls,
      });

      return pollRes;
    } catch (err) {
      console.error(`Error on geeting public polls : ${err}`);
      throw err;
    }
  }

  // Get Users created poll all
  async getMinePolls(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const polls = await this.prisma.poll.findMany({
        take: limit,
        skip: skip,
        where: {
          creatorId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          options: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      });

      const message = 'Successfully retrieved polls';

      const pollRes = new PollResponseDTO({
        message: message,
        total: polls.length,
        page: page,
        limit: limit,
        polls: polls,
      });

      return pollRes;
    } catch (err) {
      console.error(`Error on geeting public polls : ${err}`);
      throw err;
    }
  }

  // make poll to publish
  async publishPoll(pollId: string, userId: string) {
    try {
      // Check first poll exist and update is happing by same user
      const poll = await this.prisma.poll.findFirst({
        where: {
          id: pollId,
          creatorId: userId,
        },
      });

      if (!poll) {
        throw new NotFoundException('Poll not found!');
      }

      const updatedPoll = await this.prisma.poll.update({
        where: {
          id: pollId,
        },
        data: {
          isPublished: true,
        },
      });

      return {
        message: 'Poll is published now',
        id: updatedPoll.id,
      };
    } catch (err) {
      console.error(`Error upating poll :${err}`);
      throw err;
    }
  }
}

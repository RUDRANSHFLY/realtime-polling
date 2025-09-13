import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DbService) {}

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return users;
    } catch (err) {
      console.error(`Error while geeting users : ${err}`);
    }
  }
}

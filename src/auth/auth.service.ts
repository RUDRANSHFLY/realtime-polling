import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AuthResponseDTO, AuthUserDTO, SignInDTO, SignUpDTO } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: SignUpDTO): Promise<AuthResponseDTO> {
    try {
      // hash password
      const password = await argon2.hash(dto.password);

      // save the new user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: password,
          name: dto.name,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      // Reterive access Token to skip login one api
      const { accessToken } = await this.signToken(
        user.id,
        user.email,
        user.name,
      );

      const message = 'User created successfully!';

      const authUser = new AuthUserDTO({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      const authRes = new AuthResponseDTO({
        message: message,
        user: authUser,
        accessToken: accessToken,
      });

      return authRes;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(
            'Account already exists with provided email',
          );
        }
      }
      console.error(`Error on sign up user : ${err}`);
      throw err;
    }
  }

  async signIn(dto: SignInDTO): Promise<AuthResponseDTO> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: dto.email,
        },
        select: {
          id: true,
          email: true,
          passwordHash: true,
          name: true,
        },
      });

      const passwordMatches = await argon2.verify(
        user.passwordHash,
        dto.password,
      );

      if (!passwordMatches) {
        throw new ForbiddenException('Credentials Invalid');
      }

      const { accessToken } = await this.signToken(
        user.id,
        user.email,
        user.name,
      );

      const message = 'Successfully signed in';

      const authUser = new AuthUserDTO({
        id: user.id,
        name: user.name,
        email: user.email,
      });

      const authRes = new AuthResponseDTO({
        message: message,
        user: authUser,
        accessToken: accessToken,
      });

      return authRes;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new NotFoundException('User not Found');
        }
      }
      console.error(`Error on sign in the user: ${err}`);
      throw err;
    }
  }

  // helper function to sign jwt tokens for signup and signin
  private async signToken(
    userId: string,
    email: string,
    name: string,
  ): Promise<{ accessToken: string }> {
    try {
      // payload for jwt
      const payload = {
        sub: userId,
        email,
        name,
      };

      const accessToken = await this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
      });

      return {
        accessToken: accessToken,
      };
    } catch (err) {
      console.error(`Error on signToken of JWT : ${err}`);
      throw err;
    }
  }
}

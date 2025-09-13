import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}

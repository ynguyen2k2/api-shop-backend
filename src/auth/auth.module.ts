import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'user/users.module'
import { SessionModule } from 'session/session.module'

import { JwtRefreshStrategy } from 'auth/config/strategies/jwt-refresh.strategy'
import { AnonymousStrategy } from 'auth/config/strategies/anonymous.strategy'
import { JwtStrategy } from 'auth/config/strategies/jwt.strategy'
import { MailModule } from 'mail/mail.module'
import { MyLoggerModule } from 'logger/mylogger.module'
@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    MyLoggerModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}

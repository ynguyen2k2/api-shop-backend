import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/user/users.module'
import { SessionModule } from 'src/session/session.module'

import { JwtRefreshStrategy } from 'src/auth/config/strategies/jwt-refresh.strategy'
import { AnonymousStrategy } from 'src/auth/config/strategies/anonymous.strategy'
import { JwtStrategy } from 'src/auth/config/strategies/jwt.strategy'
import { MailModule } from 'src/mail/mail.module'
import { MyLoggerModule } from 'src/logger/mylogger.module'
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

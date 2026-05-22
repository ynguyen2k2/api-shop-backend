import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Query,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { LoginResponseDto } from 'src/auth/dto/login-response.dto'
import { AuthEmailLoginDto } from 'src/auth/dto/auth-email-login.dto'
import { AuthRegisterLoginDto } from 'src/auth/dto/auth-register-logic.dto'
import { AuthConfirmEmailDto } from 'src/auth/dto/auth-confirm-email.dto'
import { AuthForgotPasswordDto } from 'src/auth/dto/email-forgot-password.dto'
import { AuthResetPasswordDto } from 'src/auth/dto/auth-reset-password.dto'
import { AuthGuard } from '@nestjs/passport'
import { User } from 'src/user/domain/user'
import { NullableType } from 'src/utils/type/nullable.type'
import { RefreshResponseDto } from 'src/auth/dto/refresh-response.dto'
import { AuthUpdateDto } from 'src/auth/dto/auth-update.dto'
import { JwtPayloadType } from 'src/auth/config/strategies/types/jwt-payload.type'
import { myLogger, MyLogger } from 'src/logger/mylogger.service'

interface RefreshRequestType {
  user: JwtPayloadType & { sessionId: string; hash: string }
}

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly logger: MyLogger,
    private readonly service: AuthService,
  ) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    myLogger.log(loginDto, 'loginDto')
    myLogger.log(loginDto, 'loginDto')
    return this.service.validateLogin(loginDto)
  }

  @Post('email/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    return this.service.register(createUserDto)
  }

  @Get('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Query() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmEmailDto.hash)
  }

  @Get('email/confirm/new')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmNewEmail(
    @Query() confirmEmailDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmNewEmail(confirmEmailDto.hash)
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email)
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    )
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public me(
    @Request() request: { user: JwtPayloadType },
  ): Promise<NullableType<User>> {
    return this.service.me(request.user)
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(
    @Request()
    request: {
      user: JwtPayloadType & { sessionId: string; hash: string }
    },
  ): Promise<RefreshResponseDto> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
      hash: request.user.hash,
    })
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request: RefreshRequestType): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    })
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public update(
    @Request() request: { user: JwtPayloadType },
    @Body() userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    return this.service.update(request.user, userDto)
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Request() request: { user: JwtPayloadType },
  ): Promise<void> {
    return this.service.softDelete(request.user)
  }
}

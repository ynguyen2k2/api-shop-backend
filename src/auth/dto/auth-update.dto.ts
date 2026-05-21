import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import { FileDto } from 'files/dto/file-dto'
import { lowerCaseTransformer } from 'utils/transformers/lower-case-transformers'

export class AuthUpdateDto {
  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null

  @ApiPropertyOptional({ example: 'John', type: String })
  @IsOptional()
  @IsNotEmpty({ message: 'First name should not be empty' })
  firstName?: string

  @ApiPropertyOptional({ example: 'Doe', type: String })
  @IsOptional()
  @IsNotEmpty({ message: 'Last name should not be empty' })
  lastName?: string

  @ApiPropertyOptional({ example: 'new.email@example.com', type: String })
  @IsOptional()
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'Password should not be empty' })
  oldPassword?: string
}

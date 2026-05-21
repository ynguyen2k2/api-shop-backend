import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from 'database/config/database-config'
import { DatabaseConfig } from 'database/config/database-config.type'
import { Product } from 'product/domain/product'
import { User } from 'user/domain/user'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Review {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty({ type: () => User })
  user: User

  @ApiProperty({ type: () => Product })
  product: Product

  @ApiProperty()
  rating: number

  @ApiProperty()
  comment?: string | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}

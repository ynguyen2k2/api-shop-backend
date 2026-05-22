import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'
import { Product } from 'src/product/domain/product'
import { User } from 'src/user/domain/user'

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

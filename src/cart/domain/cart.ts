import { ApiProperty } from '@nestjs/swagger'
import { CartItem } from '~/cart/domain/cart-item'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'
import { User } from '~/user/domain/user'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Cart {
  @ApiProperty({
    type: idType,
  })
  id: string

  @ApiProperty({
    type: User,
  })
  user: User

  @ApiProperty({ type: CartItem })
  items?: CartItem[]
  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}

import { ApiProperty } from '@nestjs/swagger'
import { CartItem } from 'src/cart/domain/cart-item'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'
import { User } from 'src/user/domain/user'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Cart {
  @ApiProperty({
    type: idType,
  })
  id: string

  @ApiProperty({
    type: () => User,
  })
  user: User

  @ApiProperty({ type: () => [CartItem] })
  items?: CartItem[]
  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}

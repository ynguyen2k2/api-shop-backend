import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from 'src/database/config/database-config'
import { DatabaseConfig } from 'src/database/config/database-config.type'
import { FileType } from 'src/files/domain/file'
import { Product } from 'src/product/domain/product'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class ProductImage {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty({ type: () => FileType })
  photo?: FileType | null

  @ApiProperty({ type: () => Product })
  product?: Product | null

  @ApiProperty()
  order: number

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean
}

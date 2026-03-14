import { ApiProperty } from '@nestjs/swagger'
import { CategoryDto } from '~/categories/dto/category.dto'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class Category {
  @ApiProperty({
    type: idType,
  })
  id: number | string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty({ required: false })
  description: string | null

  @ApiProperty({ required: false })
  image: string | null

  @ApiProperty()
  isActive: boolean

  @ApiProperty({ type: () => Category })
  parent: Category | null

  @ApiProperty({ type: () => [Category] })
  children: Category[] | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}


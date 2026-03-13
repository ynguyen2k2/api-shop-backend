import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'

const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number

export class Product {
  @ApiProperty({
    type: idType,
  })
  id: string | number

  @ApiProperty({
    type: String,
  })
  name: string

  @ApiProperty({
    type: String,
  })
  description: string

  @ApiProperty({
    type: String,
  })
  shortDescription: string

  @ApiProperty({
    type: String,
  })
  specifications: string

  @ApiProperty({
    type: String,
  })
  tags: string[]
  @ApiProperty({
    type: String,
  })
  slug: string

  @ApiProperty({
    type: String,
  })
  brand: string

  // Category Table
  @ApiProperty({
    type: String,
  })
  category: string
  @ApiProperty({
    type: String,
  })
  reviews: string
  @ApiProperty({
    type: Boolean,
  })
  isActive: boolean

  @ApiProperty({
    type: Boolean,
  })
  isFeatured: boolean
  @ApiProperty({
    type: Boolean,
  })
  isNew: boolean

  @ApiProperty({
    type: Number,
  })
  averageRating: number
  @ApiProperty({
    type: Number,
  })
  totalReviews: number
  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

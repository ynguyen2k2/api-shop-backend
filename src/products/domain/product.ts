import { ApiProperty } from '@nestjs/swagger'
import databaseConfig from '~/database/config/database-config'
import { DatabaseConfig } from '~/database/config/database-config.type'
import { Variant } from '~/variants/domain/variant'

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
  description?: string | null

  @ApiProperty({
    type: String,
  })
  shortDescription?: string | null

  @ApiProperty({
    type: String,
  })
  specifications?: string | null

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
  reviews?: string | null

  @ApiProperty({
    type: Variant,
  })
  variants: Variant[]
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
  averageRating: number | null
  @ApiProperty({
    type: Number,
  })
  totalReviews: number | null
  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

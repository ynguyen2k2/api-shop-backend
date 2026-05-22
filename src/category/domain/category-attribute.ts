import { ApiProperty } from '@nestjs/swagger'
import { Attribute } from 'attribute/domain/attribute'
import { Category } from 'category/domain/category'

export class CategoryAttribute {
  @ApiProperty()
  id: string
  @ApiProperty({ type: () => Category })
  category: Category
  @ApiProperty({ type: () => Attribute })
  attribute: Attribute
  @ApiProperty()
  isVariant: boolean
  @ApiProperty()
  isRequired: boolean
  @ApiProperty()
  isFilterable: boolean
  @ApiProperty()
  createdAt: Date
  @ApiProperty()
  updatedAt: Date
  @ApiProperty()
  isActive: boolean
}

import { ApiProperty } from '@nestjs/swagger'

export class Category {
  @ApiProperty({
    type: String,
  })
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  slug: string

  @ApiProperty({ required: false })
  description: string | null

  @ApiProperty({ required: false })
  image: string | null

  @ApiProperty({ type: () => Category })
  parent: Category | null

  @ApiProperty({ type: () => [Category] })
  children: Category[] | null

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty({ type: Boolean })
  isActive: boolean
}

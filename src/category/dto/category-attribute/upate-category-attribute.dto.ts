import { PartialType } from '@nestjs/swagger'
import { CreateCategoryAttributeDto } from 'src/category/dto/category-attribute/create-category-attribute.dto'

export class UpdateCategoryAttributeDto extends PartialType(
  CreateCategoryAttributeDto,
) {}

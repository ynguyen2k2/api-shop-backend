// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger'
import { CreateAttributeValueDto } from './create-attribute-value.dto'

export class UpdateAttributeValueDto extends PartialType(
  CreateAttributeValueDto,
) {}

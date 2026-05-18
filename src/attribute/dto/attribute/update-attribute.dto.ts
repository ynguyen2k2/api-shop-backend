// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger'
import { CreateAttributeDto } from './create-attribute.dto'

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}

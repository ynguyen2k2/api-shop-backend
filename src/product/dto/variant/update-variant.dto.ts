// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger'
import { CreateVariantDto } from 'src/product/dto/variant/create-variant.dto'

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}

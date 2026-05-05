// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger'
import { CreateproductImageDto } from './create-product-image.dto'

export class UpdateproductImageDto extends PartialType(CreateproductImageDto) {}

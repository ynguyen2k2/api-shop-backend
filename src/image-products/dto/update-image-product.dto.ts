// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger'
import { CreateimageProductDto } from './create-image-product.dto'

export class UpdateimageProductDto extends PartialType(CreateimageProductDto) {}

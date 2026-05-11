// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger'
import { CreateCartItemDto } from './create-cart-item.dto'

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {}

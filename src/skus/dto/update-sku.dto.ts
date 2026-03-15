// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateskuDto } from './create-sku.dto';

export class UpdateskuDto extends PartialType(CreateskuDto) {}

---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/domain/<%= h.inflection.transform(name, ['underscore', 'dasherize']) %>.ts
---
import { ApiProperty } from '@nestjs/swagger';
import databaseConfig from '~/database/config/database-config';
import { DatabaseConfig } from '~/database/config/database-config.type';
  
const idType = (databaseConfig() as DatabaseConfig).isDocumentDatabase
  ? String
  : Number
export class <%= name %> {
  @ApiProperty({
    type: idType,
  })
  id: number | string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

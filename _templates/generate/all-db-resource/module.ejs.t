---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
---
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { <%= h.inflection.transform(name ) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= h.inflection.transform(name ) %>Controller } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller';
import { Relational<%= name %>PersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import databaseConfig from '../database/config/database.config';
import { DatabaseConfig } from '../database/config/database-config.type';
import { Document<%= name %>PersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? Document<%= name %>PersistenceModule
  : Relational<%= name %>PersistenceModule;

@Module({
  imports: [
    // do not remove this comment
    infrastructurePersistenceModule,
  ],
  controllers: [<%= h.inflection.transform(name ) %>Controller],
  providers: [<%= h.inflection.transform(name ) %>Service],
  exports: [<%= h.inflection.transform(name ) %>Service, infrastructurePersistenceModule],
})
export class <%= h.inflection.transform(name ) %>Module {}

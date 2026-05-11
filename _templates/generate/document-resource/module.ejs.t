---
to: src/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module.ts
---
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { <%= h.inflection.transform(name) %>Service } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.service';
import { <%= h.inflection.transform(name) %>Controller } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.controller';
import { Document<%= name %>PersistenceModule } from './infrastructure/persistence/document/document-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    Document<%= name %>PersistenceModule,
  ],
  controllers: [<%= h.inflection.transform(name) %>Controller],
  providers: [<%= h.inflection.transform(name) %>Service],
  exports: [<%= h.inflection.transform(name) %>Service, Document<%= name %>PersistenceModule],
})
export class <%= h.inflection.transform(name) %>Module {}

---
inject: true
to: src/app.module.ts
before: <database-block>
---
import { <%= h.inflection.transform(name, ['pluralize', 'classify']) %>Module } from './<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>/<%= h.inflection.transform(name, ['pluralize', 'underscore', 'dasherize']) %>.module';

import { Module } from '@nestjs/common'
import { AttributesService } from './attributes.service'
import { AttributesController } from './attributes.controller'
import { RelationalAttributePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { CategoryModule } from 'category/category.module'
@Module({
  imports: [
    // do not remove this comment
    RelationalAttributePersistenceModule,
    CategoryModule,
  ],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [
    AttributesService,
    RelationalAttributePersistenceModule,
    CategoryModule,
  ],
})
export class AttributesModule {}

import { Module } from '@nestjs/common'
import { AttributeService } from './attribute.service'
import { AttributeController } from './attribute.controller'
import { RelationalAttributePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
@Module({
  imports: [
    // do not remove this comment
    RelationalAttributePersistenceModule,
  ],
  controllers: [AttributeController],
  providers: [AttributeService],
  exports: [AttributeService, RelationalAttributePersistenceModule],
})
export class AttributeModule {}

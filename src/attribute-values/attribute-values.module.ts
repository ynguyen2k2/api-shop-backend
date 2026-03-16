import {
  forwardRef,
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { AttributeValuesService } from './attribute-values.service'
import { AttributeValuesController } from './attribute-values.controller'
import { RelationalattributeValuePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { AttributesModule } from '~/attributes/attributes.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalattributeValuePersistenceModule,
    forwardRef(() => AttributesModule),
  ],
  controllers: [AttributeValuesController],
  providers: [AttributeValuesService],
  exports: [AttributeValuesService, RelationalattributeValuePersistenceModule],
})
export class AttributeValuesModule {}

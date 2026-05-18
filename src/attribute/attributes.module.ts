import {
  forwardRef,
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { AttributesService } from './attributes.service'
import { AttributesController } from './attributes.controller'
import { RelationalAttributePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { AttributeValuesModule } from '~/attribute-values/attribute-values.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalAttributePersistenceModule,
    forwardRef(() => AttributeValuesModule),
  ],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService, RelationalAttributePersistenceModule],
})
export class AttributesModule {}

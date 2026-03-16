import {
  forwardRef,
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { AttributesService } from './attributes.service'
import { AttributesController } from './attributes.controller'
import { RelationalAttributePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalAttributePersistenceModule,
  ],
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService, RelationalAttributePersistenceModule],
})
export class AttributesModule {}

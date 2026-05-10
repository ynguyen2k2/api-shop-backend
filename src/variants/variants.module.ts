import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { VariantService } from './variants.service'
import { VariantController } from './variants.controller'
import { RelationalVariantPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalVariantPersistenceModule,
  ],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService, RelationalVariantPersistenceModule],
})
export class VariantModule {}

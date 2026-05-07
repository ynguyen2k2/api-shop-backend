import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { SkuService } from './skus.service'
import { SkuController } from './skus.controller'
import { RelationalskuPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalskuPersistenceModule,
  ],
  controllers: [SkuController],
  providers: [SkuService],
  exports: [SkuService, RelationalskuPersistenceModule],
})
export class SkuModule {}

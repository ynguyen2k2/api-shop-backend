import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { skusService } from './skus.service'
import { skusController } from './skus.controller'
import { RelationalskuPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalskuPersistenceModule,
  ],
  controllers: [skusController],
  providers: [skusService],
  exports: [skusService, RelationalskuPersistenceModule],
})
export class skusModule {}

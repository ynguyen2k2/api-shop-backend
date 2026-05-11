import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { InventoryService } from './inventories.service'
import { InventoryController } from './inventories.controller'
import { RelationalInventoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalInventoryPersistenceModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService, RelationalInventoryPersistenceModule],
})
export class InventoryModule {}

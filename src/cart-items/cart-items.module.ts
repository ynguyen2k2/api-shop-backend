import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { CartItemService } from './cart-items.service'
import { CartItemController } from './cart-items.controller'
import { RelationalCartItemPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalCartItemPersistenceModule,
  ],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService, RelationalCartItemPersistenceModule],
})
export class CartItemModule {}

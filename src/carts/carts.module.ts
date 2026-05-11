import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { CartService } from './carts.service'
import { CartController } from './carts.controller'
import { RelationalCartPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalCartPersistenceModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService, RelationalCartPersistenceModule],
})
export class CartModule {}

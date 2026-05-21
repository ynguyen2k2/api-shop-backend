import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CartController } from './cart.controller'
import { RelationalCartPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { UsersModule } from '~/user/users.module'
import { ProductModule } from '~/product/product.module'
@Module({
  imports: [
    // do not remove this comment
    RelationalCartPersistenceModule,
    UsersModule,
    ProductModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService, RelationalCartPersistenceModule],
})
export class CartModule {}

import { Module } from '@nestjs/common'
import { CartItemRepository } from '../cart-item.repository'
import { CartItemRelationalRepository } from './repositories/cart-item.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartItemEntity } from './entities/cart-item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity])],
  providers: [
    {
      provide: CartItemRepository,
      useClass: CartItemRelationalRepository,
    },
  ],
  exports: [CartItemRepository],
})
export class RelationalCartItemPersistenceModule {}

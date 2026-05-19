import { Module } from '@nestjs/common'
import { CartRepository } from '../../../domain/respositories/cart.repository'
import { CartRelationalRepository } from './repositories/cart.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartEntity } from './entities/cart.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity])],
  providers: [
    {
      provide: CartRepository,
      useClass: CartRelationalRepository,
    },
  ],
  exports: [CartRepository],
})
export class RelationalCartPersistenceModule {}

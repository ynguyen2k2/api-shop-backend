import { Module } from '@nestjs/common'
import { ProductRepository } from '../../../domain/respositories/product.repository'
import { ProductRelationalRepository } from './repositories/product.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities/product.entity'
import { VariantEntity } from './entities/variant.entity'
import { VariantRepository } from '~/product/domain/respositories/variant.repository'
import { VariantRelationalRepository } from '~/product/infrastructure/persistence/relational/repositories/variant.repository'
import { InventoryRepository } from '~/product/domain/respositories/inventory.repository'
import { InventoryRelationalRepository } from '~/product/infrastructure/persistence/relational/repositories/inventory.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, VariantEntity])],
  providers: [
    {
      provide: ProductRepository,
      useClass: ProductRelationalRepository,
    },
    {
      provide: VariantRepository,
      useClass: VariantRelationalRepository,
    },
    {
      provide: InventoryRepository,
      useClass: InventoryRelationalRepository,
    },
  ],
  exports: [ProductRepository, VariantRepository, InventoryRepository],
})
export class RelationalProductPersistenceModule {}

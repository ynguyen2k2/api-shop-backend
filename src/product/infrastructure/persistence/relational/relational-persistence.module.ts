import { Module } from '@nestjs/common'
import { ProductRepository } from '../../../domain/respositories/product.repository'
import { ProductRelationalRepository } from './repositories/product.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities/product.entity'
import { VariantEntity } from './entities/variant.entity'
import { VariantRepository } from 'src/product/domain/respositories/variant.repository'
import { VariantRelationalRepository } from 'src/product/infrastructure/persistence/relational/repositories/variant.repository'
import { InventoryRepository } from 'src/product/domain/respositories/inventory.repository'
import { InventoryRelationalRepository } from 'src/product/infrastructure/persistence/relational/repositories/inventory.repository'
import { InventoryEntity } from 'src/product/infrastructure/persistence/relational/entities/inventory.entity'
import { VariantAttributeValueEntity } from 'src/product/infrastructure/persistence/relational/entities/variant-attribute-value.entity'
import { ProductAttributeValueEntity } from 'src/product/infrastructure/persistence/relational/entities/product-attribute-value.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      VariantEntity,
      InventoryEntity,
      ProductAttributeValueEntity,
      VariantAttributeValueEntity,
    ]),
  ],
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

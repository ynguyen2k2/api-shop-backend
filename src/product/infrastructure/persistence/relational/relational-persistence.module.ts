import { Module } from '@nestjs/common'
import { ProductRepository } from '../../../domain/respositories/product.repository'
import { ProductRelationalRepository } from './repositories/product.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductEntity } from './entities/product.entity'
import { VariantEntity } from './entities/variant.entity'
import { VariantRepository } from '~/product/domain/respositories/variant.repository'
import { VariantRelationalRepository } from '~/product/infrastructure/persistence/relational/repositories/variant.repository'

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
  ],
  exports: [ProductRepository, VariantRepository],
})
export class RelationalProductPersistenceModule {}

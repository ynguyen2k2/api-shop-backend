import { Module } from '@nestjs/common'
import { productImageRepository } from '../product-image.repository'
import { productImageRelationalRepository } from './repositories/product-image.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { productImageEntity } from './entities/product-image.entity'

@Module({
  imports: [TypeOrmModule.forFeature([productImageEntity])],
  providers: [
    {
      provide: productImageRepository,
      useClass: productImageRelationalRepository,
    },
  ],
  exports: [productImageRepository],
})
export class RelationalproductImagePersistenceModule {}

import { Module } from '@nestjs/common'
import { imageProductRepository } from '../image-product.repository'
import { imageProductRelationalRepository } from './repositories/image-product.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { imageProductEntity } from './entities/image-product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([imageProductEntity])],
  providers: [
    {
      provide: imageProductRepository,
      useClass: imageProductRelationalRepository,
    },
  ],
  exports: [imageProductRepository],
})
export class RelationalimageProductPersistenceModule {}

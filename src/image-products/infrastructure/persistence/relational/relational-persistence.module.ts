import { Module } from '@nestjs/common'
import { ImageProductRepository } from '../image-product.repository'
import { ImageProductRelationalRepository } from './repositories/image-product.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImageProductEntity } from './entities/image-product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ImageProductEntity])],
  providers: [
    {
      provide: ImageProductRepository,
      useClass: ImageProductRelationalRepository,
    },
  ],
  exports: [ImageProductRepository],
})
export class RelationalImageProductPersistenceModule {}

import { Module } from '@nestjs/common';
import { skuRepository } from '../sku.repository';
import { skuRelationalRepository } from './repositories/sku.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { skuEntity } from './entities/sku.entity';

@Module({
  imports: [TypeOrmModule.forFeature([skuEntity])],
  providers: [
    {
      provide: skuRepository,
      useClass: skuRelationalRepository,
    },
  ],
  exports: [skuRepository],
})
export class RelationalskuPersistenceModule {}

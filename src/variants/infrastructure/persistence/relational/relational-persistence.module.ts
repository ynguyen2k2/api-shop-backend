import { Module } from '@nestjs/common'
import { VariantRepository } from '../variant.repository'
import { VariantRelationalRepository } from './repositories/variant.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VariantEntity } from './entities/variant.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VariantEntity])],
  providers: [
    {
      provide: VariantRepository,
      useClass: VariantRelationalRepository,
    },
  ],
  exports: [VariantRepository],
})
export class RelationalVariantPersistenceModule {}

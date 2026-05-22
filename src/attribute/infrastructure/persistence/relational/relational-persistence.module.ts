import { Module } from '@nestjs/common'
import { AttributeRepository } from '../../../domain/respositories/attribute.repository'
import { AttributeRelationalRepository } from './repositories/attribute.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttributeEntity } from './entities/attribute.entity'
import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { AttributeValueRelationalRepository } from 'src/attribute/infrastructure/persistence/relational/repositories/attribute-value.repository'
import { AttributeValueRepository } from 'src/attribute/domain/respositories/attribute-value.repository'

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity, AttributeValueEntity])],
  providers: [
    {
      provide: AttributeRepository,
      useClass: AttributeRelationalRepository,
    },
    {
      provide: AttributeValueRepository,
      useClass: AttributeValueRelationalRepository,
    },
  ],
  exports: [AttributeRepository, AttributeValueRepository],
})
export class RelationalAttributePersistenceModule {}

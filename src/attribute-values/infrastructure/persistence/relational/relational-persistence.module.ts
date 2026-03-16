import { Module } from '@nestjs/common'
import { AttributeValueRepository } from '../attribute-value.repository'
import { AttributeValueRelationalRepository } from './repositories/attribute-value.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttributeValueEntity } from './entities/attribute-value.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValueEntity])],
  providers: [
    {
      provide: AttributeValueRepository,
      useClass: AttributeValueRelationalRepository,
    },
  ],
  exports: [AttributeValueRepository],
})
export class RelationalattributeValuePersistenceModule {}

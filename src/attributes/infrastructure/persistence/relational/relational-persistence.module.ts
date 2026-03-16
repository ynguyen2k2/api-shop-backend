import { Module } from '@nestjs/common'
import { AttributeRepository } from '../attribute.repository'
import { AttributeRelationalRepository } from './repositories/attribute.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttributeEntity } from './entities/attribute.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity])],
  providers: [
    {
      provide: AttributeRepository,
      useClass: AttributeRelationalRepository,
    },
  ],
  exports: [AttributeRepository],
})
export class RelationalAttributePersistenceModule {}

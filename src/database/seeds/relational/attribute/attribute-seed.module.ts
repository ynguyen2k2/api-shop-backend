import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { AttributeEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { AttributeValueSeedService } from 'src/database/seeds/relational/attribute/attribute-seed.service'

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity, AttributeValueEntity])],
  providers: [AttributeValueSeedService],
  exports: [AttributeValueSeedService],
})
export class AttributeSeedModule {}

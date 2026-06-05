import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { AttributeEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { attributeValueSeed } from 'src/database/seeds/relational/attribute/attribute.seed'
import { Repository } from 'typeorm'

@Injectable()
export class AttributeValueSeedService {
  constructor(
    @InjectRepository(AttributeEntity)
    private readonly attributeRepository: Repository<AttributeEntity>,

    @InjectRepository(AttributeValueEntity)
    private readonly valueRepository: Repository<AttributeValueEntity>,
  ) {}

  async run() {
    for (const item of attributeValueSeed) {
      const attribute = await this.attributeRepository.findOne({
        where: { name: item.attribute },
      })
      if (!attribute) continue
      await this.attributeRepository.save({
        name: item.attribute,
        values: item.values,
      })
    }
  }
}

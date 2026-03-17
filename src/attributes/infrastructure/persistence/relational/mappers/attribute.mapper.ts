import { Attribute } from '~/attributes/domain/attribute'
import { AttributeEntity } from '../entities/attribute.entity'
import { AttributeValueMapper } from '~/attribute-values/infrastructure/persistence/relational/mappers/attribute-value.mapper'

export class AttributeMapper {
  static toDomain(raw: AttributeEntity): Attribute {
    const domainEntity = new Attribute()
    domainEntity.id = raw.id
    domainEntity.name = raw.name
    domainEntity.slug = raw.slug
    domainEntity.type = raw.type
    if (raw.attributeValues) {
      domainEntity.values = raw.attributeValues.map((value) =>
        AttributeValueMapper.toDomain(value),
      )
    }
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.deletedAt = raw.deletedAt
    return domainEntity
  }

  static toPersistence(domainEntity: Attribute): AttributeEntity {
    const persistenceEntity = new AttributeEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.name = domainEntity.name
    persistenceEntity.slug = domainEntity.slug
    persistenceEntity.type = domainEntity.type
    if (domainEntity.values) {
      persistenceEntity.attributeValues = domainEntity.values.map((value) =>
        AttributeValueMapper.toPersistence(value),
      )
    }
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.deletedAt = domainEntity.deletedAt
    return persistenceEntity
  }
}

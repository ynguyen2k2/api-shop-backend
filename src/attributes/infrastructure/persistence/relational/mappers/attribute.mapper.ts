import { Attribute } from '~/attributes/domain/attribute'
import { AttributeEntity } from '../entities/attribute.entity'

export class AttributeMapper {
  static toDomain(raw: AttributeEntity): Attribute {
    const domainEntity = new Attribute()
    domainEntity.id = raw.id
    domainEntity.name = raw.name
    domainEntity.slug = raw.slug
    domainEntity.type = raw.type
    domainEntity.value = raw.value
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt

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
    persistenceEntity.value = domainEntity.value
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt

    return persistenceEntity
  }
}

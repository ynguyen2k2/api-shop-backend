import { AttributeValue } from '~/attribute-values/domain/attribute-value'
import { AttributeValueEntity } from '../entities/attribute-value.entity'
import { AttributeValueRepository } from '~/attribute-values/infrastructure/persistence/attribute-value.repository'
import { AttributeEntity } from '~/attributes/infrastructure/persistence/relational/entities/attribute.entity'

export class AttributeValueMapper {
  static toDomain(raw: AttributeValueEntity): AttributeValue {
    const domainEntity = new AttributeValue()
    domainEntity.id = raw.id
    domainEntity.value = raw.value
    domainEntity.attribute = raw.attribute
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt

    return domainEntity
  }

  static toPersistence(domainEntity: AttributeValue): AttributeValueEntity {
    const persistenceEntity = new AttributeValueEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.value = domainEntity.value
    if (domainEntity.attribute) {
      const attributeEntity = new AttributeEntity()
      attributeEntity.id = domainEntity.attribute.id
      persistenceEntity.attribute = attributeEntity
    }
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt

    return persistenceEntity
  }
}

import { AttributeValue } from 'attribute/domain/attribute-value'
import { AttributeValueEntity } from 'attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { AttributeEntity } from 'attribute/infrastructure/persistence/relational/entities/attribute.entity'

export class AttributeValueMapper {
  static toDomain(raw: AttributeValueEntity): AttributeValue {
    const domainEntity = new AttributeValue()
    if (raw.id) domainEntity.id = raw.id
    domainEntity.value = raw.value

    if (raw.attribute) {
      const attributeEntity = new AttributeEntity()
      attributeEntity.id = raw.attribute.id
      domainEntity.attribute = attributeEntity
    }
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive

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
    }
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

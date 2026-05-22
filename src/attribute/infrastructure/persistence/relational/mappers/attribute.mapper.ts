import { Attribute } from 'src/attribute/domain/attribute'
import { AttributeValue } from 'src/attribute/domain/attribute-value'
import { AttributeEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { AttributeValueMapper } from 'src/attribute/infrastructure/persistence/relational/mappers/attribute-value.mapper'
import { Category } from 'src/category/domain/category'
import { CategoryEntity } from 'src/category/infrastructure/persistence/relational/entities/category.entity'

export class AttributeMapper {
  static toDomain(raw: AttributeEntity): Attribute {
    const domainEntity = new Attribute()
    if (raw.id) {
      domainEntity.id = raw.id
    }
    domainEntity.name = raw.name
    domainEntity.slug = raw.slug
    domainEntity.type = raw.type
    if (raw.attributeValues) {
      domainEntity.values = raw.attributeValues.map((value) => {
        const attributeValue = new AttributeValue()
        attributeValue.id = value.id
        attributeValue.value = value.value
        return attributeValue
      })
    }

    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
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
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

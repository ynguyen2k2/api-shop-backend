import { Attribute } from '~/attribute/domain/attribute'
import { AttributeValue } from '~/attribute/domain/attribute-value'
import { AttributeEntity } from '~/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { AttributeValueMapper } from '~/attribute/infrastructure/persistence/relational/mappers/attribute-value.mapper'
import { Category } from '~/categories/domain/category'
import { CategoryEntity } from '~/categories/infrastructure/persistence/relational/entities/category.entity'

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
    if (raw.category) {
      const category = new Category()
      category.id = raw.category.id
      category.name = raw.category.name
      domainEntity.category = category
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
    if (domainEntity.category) {
      const categoryEntity = new CategoryEntity()
      categoryEntity.id = domainEntity.category.id
      categoryEntity.name = domainEntity.category.name
      persistenceEntity.category = categoryEntity
    }
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

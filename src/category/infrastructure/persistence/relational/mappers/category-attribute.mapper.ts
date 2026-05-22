import { Attribute } from 'src/attribute/domain/attribute'
import { AttributeEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { Category } from 'src/category/domain/category'
import { CategoryAttribute } from 'src/category/domain/category-attribute'
import { CategoryAttributeEntity } from 'src/category/infrastructure/persistence/relational/entities/category-attribute.entity'
import { CategoryEntity } from 'src/category/infrastructure/persistence/relational/entities/category.entity'

export class CategoryAttributeMapper {
  static toDomain(raw: CategoryAttributeEntity): CategoryAttribute {
    const domainEntity = new CategoryAttribute()
    if (raw.id) domainEntity.id = raw.id
    if (raw.category) {
      const category = new Category()
      category.id = raw.category.id
      category.name = raw.category.name
      domainEntity.category = category
    }
    if (raw.attribute) {
      const attribute = new Attribute()
      attribute.id = raw.attribute.id
      attribute.name = raw.attribute.name
      domainEntity.attribute = attribute
    }
    domainEntity.isVariant = raw.isVariant
    domainEntity.isRequired = raw.isRequired
    domainEntity.isFilterable = raw.isFilterable
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }
  static toPersistence(
    domainEntity: CategoryAttribute,
  ): CategoryAttributeEntity {
    const persistenceEntity = new CategoryAttributeEntity()
    persistenceEntity.id = domainEntity.id
    if (domainEntity.category) {
      const categoryEntity = new CategoryEntity()
      categoryEntity.id = domainEntity.category.id
      categoryEntity.name = domainEntity.category.name
      persistenceEntity.category = categoryEntity
    }
    if (domainEntity.attribute) {
      const attributeEntity = new AttributeEntity()
      attributeEntity.id = domainEntity.attribute.id
      attributeEntity.name = domainEntity.attribute.name
      persistenceEntity.attribute = attributeEntity
    }
    persistenceEntity.isVariant = domainEntity.isVariant
    persistenceEntity.isRequired = domainEntity.isRequired
    persistenceEntity.isFilterable = domainEntity.isFilterable
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

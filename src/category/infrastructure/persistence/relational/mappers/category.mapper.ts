import { Category } from 'src/category/domain/category'
import { CategoryEntity } from '../entities/category.entity'
import { NullableType } from 'src/utils/type/nullable.type'
import { DeepPartial } from 'src/utils/type/deep-partial.type'

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const domainEntity = new Category()
    const parentCategory: NullableType<DeepPartial<Category>> = new Category()
    let childrencategory: NullableType<DeepPartial<Category[]>> = []

    if (raw.parent) {
      parentCategory.id = raw.parent.id
      parentCategory.name = raw.parent.name
      parentCategory.slug = raw.parent.slug
      parentCategory.description = raw.parent.description
      parentCategory.image = raw.parent.image
      parentCategory.isActive = raw.parent.isActive
      parentCategory.createdAt = raw.parent.createdAt
      parentCategory.updatedAt = raw.parent.updatedAt
    }

    if (raw.children) {
      // ✅ RECURSIVE MAPPING for children
      // We call 'CategoryMapper.toDomain' again for each child.
      // If a child has children, it will call itself again forever into the 2nd, 3rd, 4th levels.
      childrencategory = raw.children.map((child) =>
        CategoryMapper.toDomain(child),
      )
    }

    domainEntity.id = raw.id
    domainEntity.name = raw.name
    domainEntity.slug = raw.slug
    domainEntity.description = raw.description
    domainEntity.image = raw.image
    // Assign the safely mapped parent and explicitly mapped children arrays
    domainEntity.parent = parentCategory.id
      ? (parentCategory as Category)
      : null
    domainEntity.children =
      childrencategory.length > 0 ? (childrencategory as Category[]) : null
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive

    return domainEntity
  }

  static toPersistence(domainEntity: Category): CategoryEntity {
    const persistenceEntity = new CategoryEntity()
    let parentCategoryEntity: CategoryEntity | null = null
    let childrencategoryEntities: CategoryEntity[] | null = null

    if (domainEntity.parent) {
      parentCategoryEntity = new CategoryEntity()
      parentCategoryEntity.id = domainEntity.parent.id
      parentCategoryEntity.name = domainEntity.parent.name
      parentCategoryEntity.slug = domainEntity.parent.slug
      parentCategoryEntity.description = domainEntity.parent.description
      parentCategoryEntity.image = domainEntity.parent.image
      parentCategoryEntity.createdAt = domainEntity.parent.createdAt
      parentCategoryEntity.updatedAt = domainEntity.parent.updatedAt
      parentCategoryEntity.isActive = domainEntity.parent.isActive
    }

    if (domainEntity.children) {
      // ✅ RECURSIVE MAPPING for children
      childrencategoryEntities = domainEntity.children.map((child) =>
        CategoryMapper.toPersistence(child),
      )
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.name = domainEntity.name
    persistenceEntity.slug = domainEntity.slug
    persistenceEntity.description = domainEntity.description
    persistenceEntity.image = domainEntity.image
    persistenceEntity.isActive = domainEntity.isActive
    // Assign mapped parent and children back to the entity
    persistenceEntity.parent = parentCategoryEntity
    persistenceEntity.children = childrencategoryEntities
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt

    return persistenceEntity
  }
}

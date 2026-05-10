import { Product } from '../../../../domain/product'
import { ProductEntity } from '../entities/product.entity'

export class ProductMapper {
  static toDomain(raw: ProductEntity): Product {
    const domainEntity = new Product()
    domainEntity.id = raw.id
    domainEntity.name = raw.name
    domainEntity.description = raw.description
    domainEntity.shortDescription = raw.shortDescription
    domainEntity.specifications = raw.specifications
    domainEntity.category = raw.category
    domainEntity.brand = raw.brand
    domainEntity.isFeatured = raw.isFeatured
    domainEntity.isNew = raw.isNew
    domainEntity.averageRating = raw.averageRating
    domainEntity.totalReviews = raw.totalReviews
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive

    return domainEntity
  }

  static toPersistence(domainEntity: Product): ProductEntity {
    const persistenceEntity = new ProductEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.name = domainEntity.name
    persistenceEntity.description = domainEntity.description || null
    persistenceEntity.shortDescription = domainEntity.shortDescription || null
    persistenceEntity.specifications = domainEntity.specifications || null

    persistenceEntity.category = domainEntity.category
    persistenceEntity.brand = domainEntity.brand
    persistenceEntity.reviews = domainEntity.reviews || null
    persistenceEntity.isFeatured = domainEntity.isFeatured
    persistenceEntity.isNew = domainEntity.isNew
    persistenceEntity.averageRating = domainEntity.averageRating || 0
    persistenceEntity.totalReviews = domainEntity.totalReviews || 0
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

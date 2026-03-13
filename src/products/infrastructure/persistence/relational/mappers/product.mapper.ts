import { Product } from '../../../../domain/product'
import { ProductEntity } from '../entities/product.entity'

export class ProductMapper {
  static toDomain(raw: ProductEntity): Product {
    const domainEntity = new Product()
    domainEntity.id = raw.id
    domainEntity.name = raw.name
    domainEntity.description = raw.description

    domainEntity.category = raw.category
    domainEntity.brand = raw.brand
    domainEntity.isActive = raw.isActive
    domainEntity.isFeatured = raw.isFeatured
    domainEntity.isNew = raw.isNew
    domainEntity.averageRating = raw.averageRating
    domainEntity.totalReviews = raw.totalReviews
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt

    return domainEntity
  }

  static toPersistence(domainEntity: Product): ProductEntity {
    const persistenceEntity = new ProductEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.name = domainEntity.name
    persistenceEntity.description = domainEntity.description

    persistenceEntity.category = domainEntity.category
    persistenceEntity.brand = domainEntity.brand
    persistenceEntity.isActive = domainEntity.isActive
    persistenceEntity.isFeatured = domainEntity.isFeatured
    persistenceEntity.isNew = domainEntity.isNew
    persistenceEntity.averageRating = domainEntity.averageRating
    persistenceEntity.totalReviews = domainEntity.totalReviews
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt

    return persistenceEntity
  }
}

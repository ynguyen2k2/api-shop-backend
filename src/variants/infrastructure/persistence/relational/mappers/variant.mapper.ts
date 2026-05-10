import { Variant } from '~/variants/domain/variant'
import { VariantEntity } from '../entities/variant.entity'

export class VariantMapper {
  static toDomain(raw: VariantEntity): Variant {
    const domainEntity = new Variant()
    domainEntity.id = raw.id
    domainEntity.sku = raw.sku
    domainEntity.stock = raw.stock
    domainEntity.price = raw.price
    domainEntity.compareAtPrice = raw.compareAtPrice
    domainEntity.product = raw.product
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }

  static toPersistence(domainEntity: Variant): VariantEntity {
    if (domainEntity.product) {
      domainEntity.product.id = domainEntity.product.id
      domainEntity.product.name = domainEntity.product.name
      domainEntity.product.slug = domainEntity.product.slug
      domainEntity.product.brand = domainEntity.product.brand
      domainEntity.product.category = domainEntity.product.category
      domainEntity.product.isActive = domainEntity.product.isActive
      domainEntity.product.isFeatured = domainEntity.product.isFeatured
      domainEntity.product.isNew = domainEntity.product.isNew
      domainEntity.product.averageRating = domainEntity.product.averageRating
      domainEntity.product.totalReviews = domainEntity.product.totalReviews
      domainEntity.product.createdAt = domainEntity.product.createdAt
      domainEntity.product.updatedAt = domainEntity.product.updatedAt
    }
    const persistenceEntity = new VariantEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.sku = domainEntity.sku
    persistenceEntity.stock = domainEntity.stock
    persistenceEntity.price = domainEntity.price
    persistenceEntity.compareAtPrice = domainEntity.compareAtPrice
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

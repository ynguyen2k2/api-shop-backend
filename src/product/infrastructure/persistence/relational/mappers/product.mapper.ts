import { Product } from 'product/domain/product'
import { ProductEntity } from 'product/infrastructure/persistence/relational/entities/product.entity'
import { VariantEntity } from 'product/infrastructure/persistence/relational/entities/variant.entity'
import { VariantMapper } from 'product/infrastructure/persistence/relational/mappers/variant.mapper'

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
    if (raw.variants && raw.variants.length !== 0) {
      domainEntity.variants = raw.variants.map((variant) =>
        VariantMapper.toDomain(variant),
      )
    }

    return domainEntity
  }

  static toPersistence(domainEntity: Product): ProductEntity {
    let variants: VariantEntity[] = []
    if (domainEntity.variants && domainEntity.variants.length !== 0) {
      variants = domainEntity.variants.map((variant) => {
        const variantEntity = new VariantEntity()
        variantEntity.id = variant.id
        variantEntity.sku = variant.sku
        variantEntity.price = variant.price
        variantEntity.compareAtPrice = variant.compareAtPrice
        variantEntity.createdAt = variant.createdAt
        variantEntity.updatedAt = variant.updatedAt
        variantEntity.isActive = variant.isActive
        return variantEntity
      })
    }
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

    persistenceEntity.isFeatured = domainEntity.isFeatured
    persistenceEntity.isNew = domainEntity.isNew
    persistenceEntity.averageRating = domainEntity.averageRating || 0
    persistenceEntity.totalReviews = domainEntity.totalReviews || 0
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    persistenceEntity.variants = variants
    return persistenceEntity
  }
}

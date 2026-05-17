import { Variant } from '~/product/domain/variant'
import { VariantEntity } from '../entities/variant.entity'
import { InventoryMapper } from '~/inventories/infrastructure/persistence/relational/mappers/inventory.mapper'
import { InventoryEntity } from '~/inventories/infrastructure/persistence/relational/entities/inventory.entity'

export class VariantMapper {
  static toDomain(raw: VariantEntity): Variant {
    const domainEntity = new Variant()
    domainEntity.id = raw.id
    domainEntity.sku = raw.sku
    if (raw.inventory)
      domainEntity.inventory = InventoryMapper.toDomain(raw.inventory)
    domainEntity.price = raw.price
    domainEntity.compareAtPrice = raw.compareAtPrice
    if (raw.product) domainEntity.product.id = raw.product.id
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
    let inventory: InventoryEntity | null = null
    if (domainEntity.inventory) {
      inventory = new InventoryEntity()
      inventory.id = domainEntity.inventory.id
      inventory.quantity = domainEntity.inventory.quantity
      inventory.reserved = domainEntity.inventory.reserved
      inventory.warehouse = domainEntity.inventory.warehouse
      inventory.createdAt = domainEntity.inventory.createdAt
      inventory.updatedAt = domainEntity.inventory.updatedAt
      inventory.isActive = domainEntity.inventory.isActive
    }

    const persistenceEntity = new VariantEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.sku = domainEntity.sku
    persistenceEntity.inventory = inventory
    persistenceEntity.price = domainEntity.price
    persistenceEntity.compareAtPrice = domainEntity.compareAtPrice
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

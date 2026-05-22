import { Inventory } from 'src/product/domain/inventory'
import { InventoryEntity } from '../entities/inventory.entity'
import { VariantEntity } from 'src/product/infrastructure/persistence/relational/entities/variant.entity'

export class InventoryMapper {
  static toDomain(raw: InventoryEntity): Inventory {
    const domainEntity = new Inventory()
    domainEntity.id = raw.id
    domainEntity.quantity = raw.quantity
    domainEntity.reserved = raw.reserved
    domainEntity.warehouse = raw.warehouse

    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }

  static toPersistence(domainEntity: Inventory): InventoryEntity {
    let variant: VariantEntity | null = null
    if (domainEntity.variant) {
      variant = new VariantEntity()
      variant.id = domainEntity.variant.id
      variant.sku = domainEntity.variant.sku
      variant.price = domainEntity.variant.price
      variant.compareAtPrice = domainEntity.variant.compareAtPrice
      variant.createdAt = domainEntity.variant.createdAt
      variant.updatedAt = domainEntity.variant.updatedAt
      variant.isActive = domainEntity.variant.isActive
    }
    const persistenceEntity = new InventoryEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.quantity = domainEntity.quantity
    persistenceEntity.reserved = domainEntity.reserved
    persistenceEntity.warehouse = domainEntity.warehouse
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

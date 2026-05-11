import { CartItem } from '~/cart-items/domain/cart-item'
import { CartItemEntity } from '../entities/cart-item.entity'
import { CartMapper } from '~/carts/infrastructure/persistence/relational/mappers/cart.mapper'
import { VariantMapper } from '~/variants/infrastructure/persistence/relational/mappers/variant.mapper'
import { CartEntity } from '~/carts/infrastructure/persistence/relational/entities/cart.entity'
import { VariantEntity } from '~/variants/infrastructure/persistence/relational/entities/variant.entity'

export class CartItemMapper {
  static toDomain(raw: CartItemEntity): CartItem {
    const domainEntity = new CartItem()
    domainEntity.id = raw.id
    if (raw.cart) domainEntity.cart = CartMapper.toDomain(raw.cart)
    if (raw.variant) domainEntity.variant = VariantMapper.toDomain(raw.variant)
    domainEntity.quantity = raw.quantity
    domainEntity.priceSnapshot = raw.priceSnapshot
    domainEntity.comparePriceSnapshot = raw.comparePriceSnapshot
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }

  static toPersistence(domainEntity: CartItem): CartItemEntity {
    let cart: CartEntity
    cart = new CartEntity()
    cart.id = domainEntity.cart.id

    let variant: VariantEntity
    variant = new VariantEntity()
    variant.id = domainEntity.variant.id

    const persistenceEntity = new CartItemEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.cart = cart
    persistenceEntity.variant = variant
    persistenceEntity.quantity = domainEntity.quantity
    persistenceEntity.priceSnapshot = domainEntity.priceSnapshot
    persistenceEntity.comparePriceSnapshot = domainEntity.comparePriceSnapshot
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

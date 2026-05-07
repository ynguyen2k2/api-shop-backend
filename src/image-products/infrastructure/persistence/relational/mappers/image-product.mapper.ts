import { imageProduct } from '~/image-products/domain/image-product'
import { imageProductEntity } from '../entities/image-product.entity'

export class imageProductMapper {
  static toDomain(raw: imageProductEntity): imageProduct {
    const domainEntity = new imageProduct()
    domainEntity.id = raw.id
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt

    return domainEntity
  }

  static toPersistence(domainEntity: imageProduct): imageProductEntity {
    const persistenceEntity = new imageProductEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt

    return persistenceEntity
  }
}

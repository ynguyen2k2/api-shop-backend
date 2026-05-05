import { productImage } from '~/product-images/domain/product-image'
import { productImageEntity } from '../entities/product-image.entity'

export class productImageMapper {
  static toDomain(raw: productImageEntity): productImage {
    const domainEntity = new productImage()
    domainEntity.id = raw.id
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt

    return domainEntity
  }

  static toPersistence(domainEntity: productImage): productImageEntity {
    const persistenceEntity = new productImageEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt

    return persistenceEntity
  }
}

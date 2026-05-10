import { ImageProduct } from '~/image-products/domain/image-product'
import { ImageProductEntity } from '../entities/image-product.entity'
import { FileMapper } from '~/files/infrastructure/persistence/relational/mappers/file-mapper'
import { ProductMapper } from '~/products/infrastructure/persistence/relational/mappers/product.mapper'
import { FileEntity } from '~/files/infrastructure/persistence/relational/entities/file.entity'
import { ProductEntity } from '~/products/infrastructure/persistence/relational/entities/product.entity'

export class ImageProductMapper {
  static toDomain(raw: ImageProductEntity): ImageProduct {
    const domainEntity = new ImageProduct()
    domainEntity.id = raw.id
    if (raw.photo) domainEntity.photo = FileMapper.toDomain(raw.photo)
    if (raw.product) domainEntity.product = ProductMapper.toDomain(raw.product)
    domainEntity.order = raw.order
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }

  static toPersistence(domainEntity: ImageProduct): ImageProductEntity {
    let photo: FileEntity | undefined | null = undefined
    if (domainEntity.photo) {
      photo = new FileEntity()
      photo.id = domainEntity.photo.id
    }
    let product: ProductEntity | undefined | null = undefined
    if (domainEntity.product) {
      product = new ProductEntity()
      product.id = domainEntity.product.id
    }
    const persistenceEntity = new ImageProductEntity()
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.photo = photo
    persistenceEntity.product = product
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

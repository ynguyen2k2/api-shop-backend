import { Review } from '~/reviews/domain/review'
import { ReviewEntity } from '../entities/review.entity'
import { UserMapper } from '~/user/infrastructure/persistence/relational/mappers/user.mapper'
import { ProductMapper } from '~/products/infrastructure/persistence/relational/mappers/product.mapper'
import { UserEntity } from '~/user/infrastructure/persistence/relational/entities/user.entity'
import { ProductEntity } from '~/products/infrastructure/persistence/relational/entities/product.entity'

export class ReviewMapper {
  static toDomain(raw: ReviewEntity): Review {
    const domainEntity = new Review()
    domainEntity.id = raw.id
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user)
    }
    if (raw.product) {
      domainEntity.product = ProductMapper.toDomain(raw.product)
    }
    domainEntity.rating = raw.rating
    domainEntity.comment = raw.comment
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }

  static toPersistence(domainEntity: Review): ReviewEntity {
    const persistenceEntity = new ReviewEntity()
    let user: UserEntity
    let product: ProductEntity

    if (domainEntity.user) {
      user = new UserEntity()
      user.id = domainEntity.user.id.toString()
    }
    if (domainEntity.product) {
      product = new ProductEntity()
      product.id = domainEntity.product.id
    }
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id
    }

    persistenceEntity.rating = domainEntity.rating
    persistenceEntity.comment = domainEntity.comment
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

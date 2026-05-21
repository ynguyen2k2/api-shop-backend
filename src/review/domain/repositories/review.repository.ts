import { DeepPartial } from 'utils/type/deep-partial.type'
import { NullableType } from 'utils/type/nullable.type'
import { IPaginationOptions } from 'utils/type/pagination-options'
import { Review } from 'review/domain/review'
import { Product } from 'product/domain/product'
import { User } from 'user/domain/user'

export abstract class ReviewRepository {
  abstract create(
    data: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  ): Promise<Review>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Review[]>

  abstract findById(id: Review['id']): Promise<NullableType<Review>>

  abstract findByIds(ids: Review['id'][]): Promise<Review[]>

  abstract findAllByProductId({
    productId,
    paginationOptions,
  }: {
    productId: Product['id']
    paginationOptions: IPaginationOptions
  }): Promise<Review[]>

  abstract findAllByUserId({
    userId,
    paginationOptions,
  }: {
    userId: User['id']
    paginationOptions: IPaginationOptions
  }): Promise<Review[]>

  abstract update(
    id: Review['id'],
    payload: DeepPartial<Review>,
  ): Promise<Review | null>

  abstract remove(id: Review['id']): Promise<void>
}

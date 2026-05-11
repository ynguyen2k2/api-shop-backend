import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Review } from '~/reviews/domain/review'

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

  abstract update(
    id: Review['id'],
    payload: DeepPartial<Review>,
  ): Promise<Review | null>

  abstract remove(id: Review['id']): Promise<void>
}

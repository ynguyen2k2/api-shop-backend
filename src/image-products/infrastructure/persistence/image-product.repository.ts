import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { imageProduct } from '~/image-products/domain/image-product'

export abstract class imageProductRepository {
  abstract create(
    data: Omit<imageProduct, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<imageProduct>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<imageProduct[]>

  abstract findById(id: imageProduct['id']): Promise<NullableType<imageProduct>>

  abstract findByIds(ids: imageProduct['id'][]): Promise<imageProduct[]>

  abstract update(
    id: imageProduct['id'],
    payload: DeepPartial<imageProduct>,
  ): Promise<imageProduct | null>

  abstract remove(id: imageProduct['id']): Promise<void>
}

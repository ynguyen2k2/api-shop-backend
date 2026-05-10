import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { ImageProduct } from '~/image-products/domain/image-product'

export abstract class ImageProductRepository {
  abstract create(
    data: Omit<ImageProduct, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  ): Promise<ImageProduct>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<ImageProduct[]>

  abstract findById(id: ImageProduct['id']): Promise<NullableType<ImageProduct>>

  abstract findByIds(ids: ImageProduct['id'][]): Promise<ImageProduct[]>

  abstract update(
    id: ImageProduct['id'],
    payload: DeepPartial<ImageProduct>,
  ): Promise<ImageProduct | null>

  abstract remove(id: ImageProduct['id']): Promise<void>
}

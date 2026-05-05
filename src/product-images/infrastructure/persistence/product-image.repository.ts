import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { productImage } from '~/product-images/domain/product-image'

export abstract class productImageRepository {
  abstract create(
    data: Omit<productImage, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<productImage>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<productImage[]>

  abstract findById(id: productImage['id']): Promise<NullableType<productImage>>

  abstract findByIds(ids: productImage['id'][]): Promise<productImage[]>

  abstract update(
    id: productImage['id'],
    payload: DeepPartial<productImage>,
  ): Promise<productImage | null>

  abstract remove(id: productImage['id']): Promise<void>
}

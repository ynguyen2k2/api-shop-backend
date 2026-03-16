import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { sku } from '~/skus/domain/sku'

export abstract class skuRepository {
  abstract create(
    data: Omit<sku, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<sku>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<sku[]>

  abstract findById(id: sku['id']): Promise<NullableType<sku>>

  abstract findByIds(ids: sku['id'][]): Promise<sku[]>

  abstract update(id: sku['id'], payload: DeepPartial<sku>): Promise<sku | null>

  abstract remove(id: sku['id']): Promise<void>
}

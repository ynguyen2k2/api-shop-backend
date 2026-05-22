import { DeepPartial } from 'src/utils/type/deep-partial.type'
import { NullableType } from 'src/utils/type/nullable.type'
import { IPaginationOptions } from 'src/utils/type/pagination-options'
import { Variant } from 'src/product/domain/variant'
import { Product } from 'src/product/domain/product'

export abstract class VariantRepository {
  abstract create(
    data: Omit<Variant, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  ): Promise<Variant>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Variant[]>

  abstract findAllByProductId({
    productId,
    paginationOptions,
  }: {
    productId: Product['id']
    paginationOptions: IPaginationOptions
  }): Promise<Variant[]>

  abstract findById(id: Variant['id']): Promise<NullableType<Variant>>

  abstract findByIds(ids: Variant['id'][]): Promise<Variant[]>
  abstract findBySku(sku: Variant['sku']): Promise<NullableType<Variant>>
  abstract update(
    id: Variant['id'],
    payload: DeepPartial<Variant>,
  ): Promise<Variant | null>

  abstract remove(id: Variant['id']): Promise<void>
}

import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Product } from '../../domain/product'

export abstract class ProductRepository {
  abstract create(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Product>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Product[]>

  abstract findById(id: Product['id']): Promise<NullableType<Product>>

  abstract findByIds(ids: Product['id'][]): Promise<Product[]>

  abstract update(
    id: Product['id'],
    payload: DeepPartial<Product>,
  ): Promise<Product | null>

  abstract remove(id: Product['id']): Promise<void>
}

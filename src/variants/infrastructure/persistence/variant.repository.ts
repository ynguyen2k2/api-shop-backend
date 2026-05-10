import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Variant } from '~/variants/domain/variant'

export abstract class VariantRepository {
  abstract create(
    data: Omit<Variant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Variant>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Variant[]>

  abstract findById(id: Variant['id']): Promise<NullableType<Variant>>

  abstract findByIds(ids: Variant['id'][]): Promise<Variant[]>

  abstract update(
    id: Variant['id'],
    payload: DeepPartial<Variant>,
  ): Promise<Variant | null>

  abstract remove(id: Variant['id']): Promise<void>
}

import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Attribute } from '~/attributes/domain/attribute'

export abstract class AttributeRepository {
  abstract create(
    data: Omit<Attribute, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Attribute>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Attribute[]>

  abstract findById(id: Attribute['id']): Promise<NullableType<Attribute>>

  abstract findByIds(ids: Attribute['id'][]): Promise<Attribute[]>

  abstract update(
    id: Attribute['id'],
    payload: DeepPartial<Attribute>,
  ): Promise<Attribute | null>

  abstract remove(id: Attribute['id']): Promise<void>
}

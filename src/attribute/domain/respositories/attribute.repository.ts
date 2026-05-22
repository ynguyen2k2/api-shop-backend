import { DeepPartial } from 'src/utils/type/deep-partial.type'
import { NullableType } from 'src/utils/type/nullable.type'
import { IPaginationOptions } from 'src/utils/type/pagination-options'
import { Attribute } from '../attribute'

export abstract class AttributeRepository {
  abstract create(
    data: Omit<Attribute, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  ): Promise<Attribute>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Attribute[]>

  abstract findById(id: Attribute['id']): Promise<NullableType<Attribute>>

  abstract findBySlug(slug: string): Promise<NullableType<Attribute>>

  abstract findByIds(ids: Attribute['id'][]): Promise<Attribute[]>

  abstract update(
    id: Attribute['id'],
    payload: DeepPartial<Attribute>,
  ): Promise<Attribute | null>

  abstract remove(id: Attribute['id']): Promise<void>
}

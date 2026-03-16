import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { AttributeValue } from '~/attribute-values/domain/attribute-value'

export abstract class AttributeValueRepository {
  abstract create(
    data: Omit<AttributeValue, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AttributeValue>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<AttributeValue[]>

  abstract findById(
    id: AttributeValue['id'],
  ): Promise<NullableType<AttributeValue>>

  abstract findByIds(ids: AttributeValue['id'][]): Promise<AttributeValue[]>

  abstract update(
    id: AttributeValue['id'],
    payload: DeepPartial<AttributeValue>,
  ): Promise<AttributeValue | null>

  abstract remove(id: AttributeValue['id']): Promise<void>
}

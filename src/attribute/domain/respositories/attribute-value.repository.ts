import { Attribute } from 'attribute/domain/attribute'
import { AttributeValue } from 'attribute/domain/attribute-value'
import { DeepPartial } from 'utils/type/deep-partial.type'
import { NullableType } from 'utils/type/nullable.type'
import { IPaginationOptions } from 'utils/type/pagination-options'

export abstract class AttributeValueRepository {
  abstract create(
    data: Omit<AttributeValue, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
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

  abstract findByAttributeId(
    attributeId: Attribute['id'],
  ): Promise<AttributeValue[]>

  abstract findByValue(
    value: AttributeValue['value'],
  ): Promise<NullableType<AttributeValue>>

  abstract update(
    id: AttributeValue['id'],
    payload: DeepPartial<AttributeValue>,
  ): Promise<AttributeValue | null>

  abstract remove(id: AttributeValue['id']): Promise<void>
}

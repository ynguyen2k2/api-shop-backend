import { Attribute } from 'src/attribute/domain/attribute'
import { AttributeValue } from 'src/attribute/domain/attribute-value'
import { DeepPartial } from 'src/utils/type/deep-partial.type'
import { NullableType } from 'src/utils/type/nullable.type'
import { IPaginationOptions } from 'src/utils/type/pagination-options'

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

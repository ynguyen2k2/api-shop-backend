import { DeepPartial } from 'src/utils/type/deep-partial.type'
import { NullableType } from 'src/utils/type/nullable.type'
import { IPaginationOptions } from 'src/utils/type/pagination-options'
import { CategoryAttribute } from '../category-attribute'

export abstract class CategoryAttributeRepository {
  abstract create(
    data: Omit<
      CategoryAttribute,
      'id' | 'createdAt' | 'updatedAt' | 'isActive'
    >,
  ): Promise<CategoryAttribute>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<CategoryAttribute[]>

  abstract findById(
    id: CategoryAttribute['id'],
  ): Promise<NullableType<CategoryAttribute>>

  abstract findByIds(
    ids: CategoryAttribute['id'][],
  ): Promise<CategoryAttribute[]>

  abstract update(
    id: CategoryAttribute['id'],
    payload: DeepPartial<CategoryAttribute>,
  ): Promise<CategoryAttribute | null>

  abstract remove(id: CategoryAttribute['id']): Promise<void>
}

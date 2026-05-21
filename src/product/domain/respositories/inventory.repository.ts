import { Inventory } from 'product/domain/inventory'
import { DeepPartial } from 'utils/type/deep-partial.type'
import { NullableType } from 'utils/type/nullable.type'
import { IPaginationOptions } from 'utils/type/pagination-options'

export abstract class InventoryRepository {
  abstract create(
    data: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  ): Promise<Inventory>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Inventory[]>

  abstract findById(id: Inventory['id']): Promise<NullableType<Inventory>>

  abstract findByIds(ids: Inventory['id'][]): Promise<Inventory[]>

  abstract findByVariantId(variantId: string): Promise<NullableType<Inventory>>

  abstract update(
    id: Inventory['id'],
    payload: DeepPartial<Inventory>,
  ): Promise<Inventory | null>

  abstract remove(id: Inventory['id']): Promise<void>
  abstract save(inventory: Inventory): Promise<Inventory>
}

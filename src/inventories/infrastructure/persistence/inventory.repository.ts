import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Inventory } from '~/inventories/domain/inventory'

export abstract class InventoryRepository {
  abstract create(
    data: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Inventory>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Inventory[]>

  abstract findById(id: Inventory['id']): Promise<NullableType<Inventory>>

  abstract findByIds(ids: Inventory['id'][]): Promise<Inventory[]>

  abstract update(
    id: Inventory['id'],
    payload: DeepPartial<Inventory>,
  ): Promise<Inventory | null>

  abstract remove(id: Inventory['id']): Promise<void>
}

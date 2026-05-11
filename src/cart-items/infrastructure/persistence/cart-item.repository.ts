import { DeepPartial } from '~/utils/type/deep-partial.type'
import { NullableType } from '~/utils/type/nullable.type'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { CartItem } from '~/cart-items/domain/cart-item'

export abstract class CartItemRepository {
  abstract create(
    data: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<CartItem>

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<CartItem[]>

  abstract findById(id: CartItem['id']): Promise<NullableType<CartItem>>

  abstract findByIds(ids: CartItem['id'][]): Promise<CartItem[]>

  abstract update(
    id: CartItem['id'],
    payload: DeepPartial<CartItem>,
  ): Promise<CartItem | null>

  abstract remove(id: CartItem['id']): Promise<void>
}

import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { CartItemRepository } from './infrastructure/persistence/cart-item.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { CartItem } from './domain/cart-item'

@Injectable()
export class CartItemService {
  constructor(
    // Dependencies here
    private readonly cartItemRepository: CartItemRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCartItemDto: CreateCartItemDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.cartItemRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.cartItemRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: CartItem['id']) {
    return this.cartItemRepository.findById(id)
  }

  findByIds(ids: CartItem['id'][]) {
    return this.cartItemRepository.findByIds(ids)
  }

  async update(
    id: CartItem['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCartItemDto: UpdateCartItemDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.cartItemRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: CartItem['id']) {
    return this.cartItemRepository.remove(id)
  }
}

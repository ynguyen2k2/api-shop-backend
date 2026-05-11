import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { CartRepository } from './infrastructure/persistence/cart.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Cart } from './domain/cart'

@Injectable()
export class CartService {
  constructor(
    // Dependencies here
    private readonly cartRepository: CartRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCartDto: CreateCartDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.cartRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.cartRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: Cart['id']) {
    return this.cartRepository.findById(id)
  }

  findByIds(ids: Cart['id'][]) {
    return this.cartRepository.findByIds(ids)
  }

  async update(
    id: Cart['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCartDto: UpdateCartDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.cartRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: Cart['id']) {
    return this.cartRepository.remove(id)
  }
}

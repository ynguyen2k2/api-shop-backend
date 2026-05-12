import {
  // common
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { CartRepository } from './infrastructure/persistence/cart.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Cart } from './domain/cart'
import { UsersService } from '~/user/users.service'
import { CartItem } from '~/cart-items/domain/cart-item'
import { CartItemService } from '~/cart-items/cart-items.service'

@Injectable()
export class CartService {
  constructor(
    // Dependencies here
    private readonly cartRepository: CartRepository,
    private readonly userService: UsersService,
    private readonly cartItemService: CartItemService,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCartDto: CreateCartDto,
  ) {
    const userId = createCartDto.user.id
    const user = await this.userService.findById(userId)
    if (!user) throw new NotFoundException('User is not found')

    return this.cartRepository.create({
      user,
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
    if (updateCartDto.user) {
      const userId = updateCartDto?.user.id
      const user = await this.userService.findById(userId)
      if (!user) throw new NotFoundException('User is not found')
      updateCartDto.user = user
    }

    const cartItemLength = updateCartDto.cartItems?.length ?? 0
    if (cartItemLength > 0 && updateCartDto.cartItems) {
      const cartItemIds = updateCartDto.cartItems.map((item) => item.id)
      const cartItems = this.cartItemService.findByIds(cartItemIds)
      if (!cartItems) throw new NotFoundException('CartItem is not found!')
    }
    return this.cartRepository.update(id, {
      ...updateCartDto,
    })
  }

  remove(id: Cart['id']) {
    return this.cartRepository.remove(id)
  }
}

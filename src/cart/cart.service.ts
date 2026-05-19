import {
  // common
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CreateCartDto } from './dto/cart/create-cart.dto'
import { UpdateCartDto } from './dto/cart/update-cart.dto'
import { CartRepository } from './domain/respositories/cart.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Cart } from './domain/cart'
import { UsersService } from '~/user/users.service'
import { CartItem } from '~/cart/domain/cart-item'
import { User } from '~/user/domain/user'
import { CartDto } from '~/cart/dto/cart/cart.dto'
import { VariantDto } from '~/product/dto/variant/variant.dto'
import { VariantRepository } from '~/product/domain/respositories/variant.repository'

@Injectable()
export class CartService {
  constructor(
    // Dependencies here
    private readonly cartRepository: CartRepository,
    private readonly userService: UsersService,
    private readonly variantRepository: VariantRepository,
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

    return this.cartRepository.update(id, {
      ...updateCartDto,
    })
  }

  remove(id: Cart['id']) {
    return this.cartRepository.remove(id)
  }

  async addItem({
    cartId,
    variantId,
    quantity,
  }: {
    cartId: CartDto['id']
    variantId: VariantDto['id']
    quantity: number
  }) {
    const cart = await this.cartRepository.findById(cartId)
    if (!cart) throw new NotFoundException('Cart is not found')

    const variant = await this.variantRepository.findById(variantId)
    if (!variant) throw new NotFoundException('Variant is not found')

    const existingItem = cart.items?.find(
      (item) => item.variant.id === variantId,
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const cartItem = new CartItem()
      cartItem.variant = variant
      cartItem.quantity = quantity
      cartItem.priceSnapshot = variant.price
      cartItem.comparePriceSnapshot = variant.compareAtPrice
      if (!cart.items) {
        cart.items = []
      }
      cart.items.push(cartItem)
    }

    return this.cartRepository.update(cartId, {
      items: cart.items,
    })
  }

  async removeItem({
    cartId,
    variantId,
  }: {
    cartId: CartDto['id']
    variantId: VariantDto['id']
  }) {
    const cart = await this.cartRepository.findById(cartId)
    if (!cart) throw new NotFoundException('Cart is not found')

    const existingItem = cart.items?.find(
      (item) => item.variant.id === variantId,
    )
    if (!existingItem)
      throw new UnprocessableEntityException('Item is not in cart')

    cart.items = cart.items?.filter((item) => item.variant.id !== variantId)

    return this.cartRepository.update(cartId, {
      items: cart.items,
    })
  }

  async updateItemQuantity({
    cartId,
    variantId,
    quantity,
  }: {
    cartId: CartDto['id']
    variantId: VariantDto['id']
    quantity: number
  }) {
    const cart = await this.cartRepository.findById(cartId)
    if (!cart) throw new NotFoundException('Cart is not found')

    const existingItem = cart.items?.find(
      (item) => item.variant.id === variantId,
    )
    if (!existingItem) {
      throw new UnprocessableEntityException('Item is not in cart')
    }
    existingItem.quantity = quantity
    if (quantity <= 0) {
      return this.removeItem({ cartId, variantId })
    }
    return this.cartRepository.update(cartId, {
      items: cart.items,
    })
  }

  // checkout(userId: User['id']) {}
}

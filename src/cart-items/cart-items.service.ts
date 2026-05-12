import {
  // common
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCartItemDto } from './dto/create-cart-item.dto'
import { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { CartItemRepository } from './infrastructure/persistence/cart-item.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { CartItem } from './domain/cart-item'
import { CartService } from '~/carts/carts.service'
import { ProductsService } from '~/products/products.service'
import { VariantService } from '~/variants/variants.service'
import { Cart } from '~/carts/domain/cart'
import { Variant } from '~/variants/domain/variant'

@Injectable()
export class CartItemService {
  constructor(
    // Dependencies here
    private readonly cartItemRepository: CartItemRepository,
    private readonly cartService: CartService,
    private readonly variantService: VariantService,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCartItemDto: CreateCartItemDto,
  ) {
    const cartId = createCartItemDto.cart.id
    const cart = await this.cartService.findById(cartId)
    if (!cart) {
      throw new NotFoundException('Cart is not found')
    }

    const variantId = createCartItemDto.variant.id
    const variant = await this.variantService.findById(variantId)
    if (!variant) {
      throw new NotFoundException('Variant is not found')
    }

    return this.cartItemRepository.create({
      ...createCartItemDto,
      cart,
      variant,
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
    const cartId = updateCartItemDto.cart?.id
    if (cartId) {
      const cart = await this.cartService.findById(cartId)
      if (!cart) throw new NotFoundException('Cart is not found')
    }

    const variantId = updateCartItemDto.variant?.id
    if (variantId) {
      const variant = await this.variantService.findById(variantId)
      if (!variant) throw new NotFoundException('Variant is not found')
    }

    return this.cartItemRepository.update(id, {
      ...updateCartItemDto,
    })
  }

  remove(id: CartItem['id']) {
    return this.cartItemRepository.remove(id)
  }
}

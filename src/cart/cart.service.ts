import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { CreateCartDto } from './dto/cart/create-cart.dto'
import { UpdateCartDto } from './dto/cart/update-cart.dto'
import { CartRepository } from './domain/respositories/cart.repository'
import { Cart } from './domain/cart'
import { UserService } from 'src/user/users.service'
import { CartItem } from 'src/cart/domain/cart-item'
import { CartDto } from 'src/cart/dto/cart/cart.dto'
import { VariantDto } from 'src/product/dto/variant/variant.dto'
import { ProductVariantService } from 'src/product/services/product-variant.service'
import { ProductInventoryService } from 'src/product/services/product-inventory.service'
@Injectable()
export class CartService {
  constructor(
    // Dependencies here
    private readonly cartRepository: CartRepository,
    private readonly userService: UserService,
    private readonly variantService: ProductVariantService,
    private readonly inventoryService: ProductInventoryService,
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

  findById(id: Cart['id']) {
    return this.cartRepository.findById(id)
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
    if (!cart)
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'cartNotFound',
        },
      })

    const variant = await this.variantService.findById(variantId)
    if (!variant)
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'variantNotFound',
        },
      })

    const existingItem = cart.items?.find(
      (item) => item.variant.id === variantId,
    )

    const isAvailable = await this.inventoryService.validateAvailableStock(
      variantId,
      quantity,
    )

    if (existingItem && isAvailable) {
      existingItem.quantity += quantity
    } else if (isAvailable) {
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
    if (!cart)
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'cartNotFound',
        },
      })

    const existingItem = cart.items?.find(
      (item) => item.variant.id === variantId,
    )
    if (!existingItem)
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'itemNotInCart',
        },
      })

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
    if (!cart)
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'cartNotFound',
        },
      })

    const existingItem = cart.items?.find(
      (item) => item.variant.id === variantId,
    )
    if (!existingItem) {
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'itemNotInCart',
        },
      })
    }

    const isAvailable = await this.inventoryService.validateAvailableStock(
      variantId,
      quantity,
    )

    if (isAvailable) {
      existingItem.quantity = quantity
    }

    if (existingItem.quantity <= 0) {
      return this.removeItem({ cartId, variantId })
    }
    return this.cartRepository.update(cartId, {
      items: cart.items,
    })
  }

  // checkout(userId: User['id']) {}
}

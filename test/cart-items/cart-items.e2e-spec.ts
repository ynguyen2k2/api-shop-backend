import { Test, TestingModule } from '@nestjs/testing'
import { CartItemController } from '~/cart-items/cart-items.controller'
import { CartItemService } from '~/cart-items/cart-items.service'
import { CreateCartItemDto } from '~/cart-items/dto/create-cart-item.dto'
import { UpdateCartItemDto } from '~/cart-items/dto/update-cart-item.dto'
import { CartItem } from '~/cart-items/domain/cart-item'

const mockCart = {
  id: 'cart-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockVariant = {
  id: 'variant-1',
  sku: 'SKU-IP16PRO-128',
  price: 999.99,
  compareAtPrice: 1099.99,
  product: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockCartItem: CartItem = {
  id: 'cart-item-1',
  cart: mockCart as any,
  variant: mockVariant as any,
  quantity: 2,
  priceSnapshot: 999.99,
  comparePriceSnapshot: 1099.99,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockCartItem2: CartItem = {
  id: 'cart-item-2',
  cart: mockCart as any,
  variant: mockVariant as any,
  quantity: 1,
  priceSnapshot: 199.99,
  comparePriceSnapshot: 249.99,
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
  isActive: true,
}

const mockCartItemService = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('CartItemController', () => {
  let controller: CartItemController
  let service: typeof mockCartItemService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: CartItemService,
          useValue: mockCartItemService,
        },
      ],
    }).compile()

    controller = module.get<CartItemController>(CartItemController)
    service = mockCartItemService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /cart-items  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create a cart item and return it', async () => {
      const dto: CreateCartItemDto = {}

      service.create.mockResolvedValue(mockCartItem)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCartItem)
    })

    it('should return the created cart item with correct properties', async () => {
      const dto: CreateCartItemDto = {}

      service.create.mockResolvedValue(mockCartItem)

      const result = await controller.create(dto)

      expect(result.id).toBe('cart-item-1')
      expect(result.quantity).toBe(2)
      expect(result.priceSnapshot).toBe(999.99)
      expect(result.comparePriceSnapshot).toBe(1099.99)
      expect(result.isActive).toBe(true)
    })

    it('should return cart item with cart and variant relations', async () => {
      const dto: CreateCartItemDto = {}

      service.create.mockResolvedValue(mockCartItem)

      const result = await controller.create(dto)

      expect(result.cart).toBeDefined()
      expect(result.cart.id).toBe('cart-1')
      
      expect(result.variant).toBeDefined()
      expect(result.variant.id).toBe('variant-1')
      expect(result.variant.sku).toBe('SKU-IP16PRO-128')
    })
  })

  // ──────────────────────────────────────────────
  // GET /cart-items  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated cart items', async () => {
      const data = [mockCartItem, mockCartItem2]
      service.findAllWithPagination.mockResolvedValue(data)

      const result = await controller.findAll({ page: 1, limit: 10 })

      expect(service.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toEqual(data)
      expect(result.hasNextPage).toBe(false) // 2 items < limit of 10
    })

    it('should default to page 1 and limit 10 when query is empty', async () => {
      service.findAllWithPagination.mockResolvedValue([])

      const result = await controller.findAll({})

      expect(service.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toEqual([])
      expect(result.hasNextPage).toBe(false)
    })

    it('should cap limit at 50', async () => {
      service.findAllWithPagination.mockResolvedValue([])

      await controller.findAll({ page: 1, limit: 100 })

      expect(service.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 50 },
      })
    })

    it('should report hasNextPage true when data length equals limit', async () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        ...mockCartItem,
        id: `cart-item-${i + 1}`,
      }))
      service.findAllWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true) // 5 items === limit of 5
    })
  })

  // ──────────────────────────────────────────────
  // GET /cart-items/:id  →  findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the cart item by id', async () => {
      service.findById.mockResolvedValue(mockCartItem)

      const result = await controller.findById('cart-item-1')

      expect(service.findById).toHaveBeenCalledWith('cart-item-1')
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCartItem)
    })

    it('should return null when cart item is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findById('non-existent-cart-item')

      expect(service.findById).toHaveBeenCalledWith('non-existent-cart-item')
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /cart-items/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update a cart item quantity', async () => {
      const dto: UpdateCartItemDto = {}
      const updated = { ...mockCartItem, quantity: 5 }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('cart-item-1', dto)

      expect(service.update).toHaveBeenCalledWith('cart-item-1', dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(updated)
      expect(result!.quantity).toBe(5)
    })

    it('should return null when updating a non-existent cart item', async () => {
      const dto: UpdateCartItemDto = {}

      service.update.mockResolvedValue(null)

      const result = await controller.update('non-existent-cart-item', dto)

      expect(service.update).toHaveBeenCalledWith('non-existent-cart-item', dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /cart-items/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a cart item by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove('cart-item-1')

      expect(service.remove).toHaveBeenCalledWith('cart-item-1')
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

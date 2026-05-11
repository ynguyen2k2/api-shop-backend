import { Test, TestingModule } from '@nestjs/testing'
import { CartController } from '~/carts/carts.controller'
import { CartService } from '~/carts/carts.service'
import { CreateCartDto } from '~/carts/dto/create-cart.dto'
import { UpdateCartDto } from '~/carts/dto/update-cart.dto'
import { Cart } from '~/carts/domain/cart'

const mockCart: Cart = {
  id: 'cart-1',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockCart2: Cart = {
  id: 'cart-2',
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
  isActive: true,
}

const mockCartService = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('CartController', () => {
  let controller: CartController
  let service: typeof mockCartService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile()

    controller = module.get<CartController>(CartController)
    service = mockCartService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /carts  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create a cart and return it', async () => {
      const dto: CreateCartDto = {}

      service.create.mockResolvedValue(mockCart)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCart)
    })

    it('should return the created cart with correct properties', async () => {
      const dto: CreateCartDto = {}

      service.create.mockResolvedValue(mockCart)

      const result = await controller.create(dto)

      expect(result.id).toBe('cart-1')
      expect(result.isActive).toBe(true)
    })
  })

  // ──────────────────────────────────────────────
  // GET /carts  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated carts', async () => {
      const data = [mockCart, mockCart2]
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
        ...mockCart,
        id: `cart-${i + 1}`,
      }))
      service.findAllWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true) // 5 items === limit of 5
    })
  })

  // ──────────────────────────────────────────────
  // GET /carts/:id  →  findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the cart by id', async () => {
      service.findById.mockResolvedValue(mockCart)

      const result = await controller.findById('cart-1')

      expect(service.findById).toHaveBeenCalledWith('cart-1')
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCart)
    })

    it('should return null when cart is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findById('non-existent-cart')

      expect(service.findById).toHaveBeenCalledWith('non-existent-cart')
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /carts/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update a cart', async () => {
      const dto: UpdateCartDto = {}
      const updated = { ...mockCart, isActive: false }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('cart-1', dto)

      expect(service.update).toHaveBeenCalledWith('cart-1', dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(updated)
      expect(result!.isActive).toBe(false)
    })

    it('should return null when updating a non-existent cart', async () => {
      const dto: UpdateCartDto = {}

      service.update.mockResolvedValue(null)

      const result = await controller.update('non-existent-cart', dto)

      expect(service.update).toHaveBeenCalledWith('non-existent-cart', dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /carts/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a cart by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove('cart-1')

      expect(service.remove).toHaveBeenCalledWith('cart-1')
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

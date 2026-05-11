import { Test, TestingModule } from '@nestjs/testing'
import { CartItemService } from '~/cart-items/cart-items.service'
import { CartItemRepository } from '~/cart-items/infrastructure/persistence/cart-item.repository'
import { CartItem } from '~/cart-items/domain/cart-item'
import { CreateCartItemDto } from '~/cart-items/dto/create-cart-item.dto'
import { UpdateCartItemDto } from '~/cart-items/dto/update-cart-item.dto'

const mockCartItem: CartItem = {
  id: 'ci-1', cart: { id: 'cart-1' } as any, variant: { id: 'v-1', sku: 'SKU-001' } as any,
  quantity: 2, priceSnapshot: 999.99, comparePriceSnapshot: 1099.99,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockCartItem2: CartItem = {
  id: 'ci-2', cart: { id: 'cart-1' } as any, variant: { id: 'v-2', sku: 'SKU-002' } as any,
  quantity: 1, priceSnapshot: 199.99, comparePriceSnapshot: 249.99,
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockCartItemRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

describe('CartItemService', () => {
  let service: CartItemService
  let repository: typeof mockCartItemRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        { provide: CartItemRepository, useValue: mockCartItemRepository },
      ],
    }).compile()
    service = module.get<CartItemService>(CartItemService)
    repository = mockCartItemRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create a cart item', async () => {
      const dto: CreateCartItemDto = {}
      repository.create.mockResolvedValue(mockCartItem)
      const result = await service.create(dto)
      expect(repository.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCartItem)
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated cart items', async () => {
      repository.findAllWithPagination.mockResolvedValue([mockCartItem, mockCartItem2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no cart items exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the cart item by id', async () => {
      repository.findById.mockResolvedValue(mockCartItem)
      const result = await service.findById('ci-1')
      expect(repository.findById).toHaveBeenCalledWith('ci-1')
      expect(result).toEqual(mockCartItem)
    })

    it('should return null when cart item is not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return cart items by ids', async () => {
      repository.findByIds.mockResolvedValue([mockCartItem, mockCartItem2])
      const result = await service.findByIds(['ci-1', 'ci-2'])
      expect(repository.findByIds).toHaveBeenCalledWith(['ci-1', 'ci-2'])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update a cart item', async () => {
      const dto: UpdateCartItemDto = {}
      repository.update.mockResolvedValue({ ...mockCartItem, quantity: 5 })
      const result = await service.update('ci-1', dto)
      expect(repository.update).toHaveBeenCalledWith('ci-1', {})
      expect(result).toBeDefined()
    })

    it('should return null when updating non-existent cart item', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update('non-existent', {})
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove a cart item by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove('ci-1')
      expect(repository.remove).toHaveBeenCalledWith('ci-1')
      expect(result).toBeUndefined()
    })
  })
})

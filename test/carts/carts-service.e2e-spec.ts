import { Test, TestingModule } from '@nestjs/testing'
import { CartService } from '~/carts/carts.service'
import { CartRepository } from '~/carts/infrastructure/persistence/cart.repository'
import { Cart } from '~/carts/domain/cart'
import { CreateCartDto } from '~/carts/dto/create-cart.dto'
import { UpdateCartDto } from '~/carts/dto/update-cart.dto'

const mockCart: Cart = {
  id: 'cart-1', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockCart2: Cart = {
  id: 'cart-2', createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockCartRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

describe('CartService', () => {
  let service: CartService
  let repository: typeof mockCartRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: CartRepository, useValue: mockCartRepository },
      ],
    }).compile()
    service = module.get<CartService>(CartService)
    repository = mockCartRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create a cart', async () => {
      const dto: CreateCartDto = {}
      repository.create.mockResolvedValue(mockCart)
      const result = await service.create(dto)
      expect(repository.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCart)
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated carts', async () => {
      repository.findAllWithPagination.mockResolvedValue([mockCart, mockCart2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no carts exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the cart by id', async () => {
      repository.findById.mockResolvedValue(mockCart)
      const result = await service.findById('cart-1')
      expect(repository.findById).toHaveBeenCalledWith('cart-1')
      expect(result).toEqual(mockCart)
    })

    it('should return null when cart is not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById('non-existent')
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return carts by ids', async () => {
      repository.findByIds.mockResolvedValue([mockCart, mockCart2])
      const result = await service.findByIds(['cart-1', 'cart-2'])
      expect(repository.findByIds).toHaveBeenCalledWith(['cart-1', 'cart-2'])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update a cart', async () => {
      const dto: UpdateCartDto = {}
      repository.update.mockResolvedValue({ ...mockCart, isActive: false })
      const result = await service.update('cart-1', dto)
      expect(repository.update).toHaveBeenCalledWith('cart-1', {})
      expect(result).toBeDefined()
    })

    it('should return null when updating non-existent cart', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update('non-existent', {})
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove a cart by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove('cart-1')
      expect(repository.remove).toHaveBeenCalledWith('cart-1')
      expect(result).toBeUndefined()
    })
  })
})

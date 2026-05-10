import { Test, TestingModule } from '@nestjs/testing'
import { VariantController } from '~/variants/variants.controller'
import { VariantService } from '~/variants/variants.service'
import { CreateVariantDto } from '~/variants/dto/create-variant.dto'
import { UpdateVariantDto } from '~/variants/dto/update-variant.dto'
import { Variant } from '~/variants/domain/variant'

const mockProduct = {
  id: 1,
  name: 'iPhone 16 Pro',
  slug: 'iphone-16-pro',
  brand: 'Apple',
  category: 'Smartphones',
  isActive: true,
  isFeatured: true,
  isNew: true,
  averageRating: 4.8,
  totalReviews: 120,
  variants: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const mockVariant: Variant = {
  id: 1,
  sku: 'SKU-IP16PRO-128',
  stock: 50,
  price: 999.99,
  compareAtPrice: 1099.99,
  product: mockProduct as any,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockVariant2: Variant = {
  id: 2,
  sku: 'SKU-IP16PRO-256',
  stock: 30,
  price: 1099.99,
  compareAtPrice: 1199.99,
  product: mockProduct as any,
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
  isActive: true,
}

const mockVariantService = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('VariantController', () => {
  let controller: VariantController
  let service: typeof mockVariantService

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantController],
      providers: [
        {
          provide: VariantService,
          useValue: mockVariantService,
        },
      ],
    }).compile()

    controller = module.get<VariantController>(VariantController)
    service = mockVariantService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /variants  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create a variant', async () => {
      const dto: CreateVariantDto = {
        price: 999.99,
        stock: 50,
        compareAtPrice: 1099.99,
        product: { id: '1' },
      }

      service.create.mockResolvedValue(mockVariant)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockVariant)
    })

    it('should return the created variant with correct properties', async () => {
      const dto: CreateVariantDto = {
        price: 999.99,
        stock: 50,
        compareAtPrice: 1099.99,
        product: { id: '1' },
      }

      service.create.mockResolvedValue(mockVariant)

      const result = await controller.create(dto)

      expect(result.sku).toBe('SKU-IP16PRO-128')
      expect(result.stock).toBe(50)
      expect(result.price).toBe(999.99)
      expect(result.isActive).toBe(true)
    })
  })

  // ──────────────────────────────────────────────
  // GET /variants  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated variants', async () => {
      const data = [mockVariant, mockVariant2]
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
        ...mockVariant,
        id: i + 1,
      }))
      service.findAllWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true) // 5 items === limit of 5
    })

    it('should handle page 2 correctly', async () => {
      service.findAllWithPagination.mockResolvedValue([mockVariant2])

      const result = await controller.findAll({ page: 2, limit: 1 })

      expect(service.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 2, limit: 1 },
      })
      expect(result.data).toHaveLength(1)
      expect(result.hasNextPage).toBe(true)
    })
  })

  // ──────────────────────────────────────────────
  // GET /variants/:id  →  findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the variant by id', async () => {
      service.findById.mockResolvedValue(mockVariant)

      const result = await controller.findById('1')

      expect(service.findById).toHaveBeenCalledWith('1')
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockVariant)
    })

    it('should return null when variant is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findById('999')

      expect(service.findById).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /variants/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update a variant', async () => {
      const dto: UpdateVariantDto = {}
      const updated = { ...mockVariant }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith('1', dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(updated)
    })

    it('should return null when updating a non-existent variant', async () => {
      const dto: UpdateVariantDto = {}

      service.update.mockResolvedValue(null)

      const result = await controller.update('999', dto)

      expect(service.update).toHaveBeenCalledWith('999', dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /variants/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a variant by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove('1')

      expect(service.remove).toHaveBeenCalledWith('1')
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

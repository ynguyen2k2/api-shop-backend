import { Test, TestingModule } from '@nestjs/testing'
import { VariantService } from '~/variants/variants.service'
import { VariantRepository } from '~/variants/infrastructure/persistence/variant.repository'
import { Variant } from '~/variants/domain/variant'
import { CreateVariantDto } from '~/variants/dto/create-variant.dto'
import { UpdateVariantDto } from '~/variants/dto/update-variant.dto'

const mockVariant: Variant = {
  id: 1, sku: 'SKU-IP16PRO-128', price: 999.99, compareAtPrice: 1099.99,
  inventory: null, product: { id: 1, name: 'iPhone 16 Pro' } as any,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockVariant2: Variant = {
  id: 2, sku: 'SKU-IP16PRO-256', price: 1099.99, compareAtPrice: 1199.99,
  inventory: null, product: { id: 1, name: 'iPhone 16 Pro' } as any,
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockVariantRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

describe('VariantService', () => {
  let service: VariantService
  let repository: typeof mockVariantRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantService,
        { provide: VariantRepository, useValue: mockVariantRepository },
      ],
    }).compile()
    service = module.get<VariantService>(VariantService)
    repository = mockVariantRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create a variant', async () => {
      const dto: CreateVariantDto = { price: 999.99, stock: 50, compareAtPrice: 1099.99, product: { id: '1' } }
      repository.create.mockResolvedValue(mockVariant)
      const result = await service.create(dto)
      expect(repository.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockVariant)
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated variants', async () => {
      repository.findAllWithPagination.mockResolvedValue([mockVariant, mockVariant2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no variants exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })

    it('should forward pagination options correctly', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      await service.findAllWithPagination({ paginationOptions: { page: 3, limit: 25 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 3, limit: 25 } })
    })
  })

  describe('findById', () => {
    it('should return the variant by id', async () => {
      repository.findById.mockResolvedValue(mockVariant)
      const result = await service.findById(1)
      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockVariant)
    })

    it('should return null when variant is not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return variants by ids', async () => {
      repository.findByIds.mockResolvedValue([mockVariant, mockVariant2])
      const result = await service.findByIds([1, 2])
      expect(repository.findByIds).toHaveBeenCalledWith([1, 2])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update a variant', async () => {
      const dto: UpdateVariantDto = { price: 899.99 }
      repository.update.mockResolvedValue({ ...mockVariant, price: 899.99 })
      const result = await service.update(1, dto)
      expect(repository.update).toHaveBeenCalledWith(1, {})
      expect(result).toBeDefined()
    })

    it('should return null when updating non-existent variant', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update(999, { price: 0 })
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove a variant by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove(1)
      expect(repository.remove).toHaveBeenCalledWith(1)
      expect(result).toBeUndefined()
    })
  })
})

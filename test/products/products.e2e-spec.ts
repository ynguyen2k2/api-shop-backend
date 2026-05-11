import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from '~/products/products.service'
import { ProductRepository } from '~/products/infrastructure/persistence/product.repository'
import { Product } from '~/products/domain/product'
import { CreateProductDto } from '~/products/dto/create-product.dto'
import { UpdateProductDto } from '~/products/dto/update-product.dto'

// ─── Mock Data ──────────────────────────────────────────────────

const mockProduct: Product = {
  id: 1,
  name: 'iPhone 16 Pro',
  slug: 'iphone-16-pro',
  brand: 'Apple',
  category: 'Smartphones',
  description: 'Latest Apple flagship',
  shortDescription: 'Apple flagship phone',
  specifications: '6.3" OLED, A18 Pro',
  reviews: null,
  variants: [],
  isActive: true,
  isFeatured: true,
  isNew: true,
  averageRating: 4.8,
  totalReviews: 120,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const mockProduct2: Product = {
  id: 2,
  name: 'Samsung Galaxy S26',
  slug: 'samsung-galaxy-s26',
  brand: 'Samsung',
  category: 'Smartphones',
  description: 'Samsung flagship',
  shortDescription: null,
  specifications: null,
  reviews: null,
  variants: [],
  isActive: true,
  isFeatured: false,
  isNew: true,
  averageRating: 4.5,
  totalReviews: 80,
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
}

// ─── Mock Providers ─────────────────────────────────────────────

const mockProductRepository = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  findByIds: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

// ─── Test Suite ─────────────────────────────────────────────────

describe('ProductsService', () => {
  let service: ProductsService
  let repository: typeof mockProductRepository

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile()

    service = module.get<ProductsService>(ProductsService)
    repository = mockProductRepository
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create a product with a generated slug', async () => {
      const dto: CreateProductDto = {
        name: 'iPhone 16 Pro',
        slug: '',
        brand: 'Apple',
        category: 'Smartphones',
        description: 'Latest Apple flagship',
        shortDescription: 'Apple flagship phone',
        specifications: '6.3" OLED, A18 Pro',
        reviews: '',
        tags: [],
        isActive: true,
        isFeatured: true,
        isNew: true,
        averageRating: 4.8,
        totalReviews: 120,
      }

      repository.create.mockResolvedValue(mockProduct)

      const result = await service.create(dto)

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'iphone-16-pro',
        }),
      )
      expect(result).toEqual(mockProduct)
    })

    it('should generate correct slug from product name', async () => {
      const dto: CreateProductDto = {
        name: 'Samsung Galaxy S26 Ultra',
        slug: '',
        brand: 'Samsung',
        category: 'Smartphones',
        description: '',
        shortDescription: '',
        specifications: '',
        reviews: '',
        tags: [],
        isActive: true,
        isFeatured: false,
        isNew: true,
        averageRating: 0,
        totalReviews: 0,
      }

      repository.create.mockResolvedValue(mockProduct2)

      await service.create(dto)

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'samsung-galaxy-s26-ultra',
        }),
      )
    })
  })

  // ──────────────────────────────────────────────
  // findAllWithPagination()
  // ──────────────────────────────────────────────
  describe('findAllWithPagination', () => {
    it('should return paginated products', async () => {
      const data = [mockProduct, mockProduct2]
      repository.findAllWithPagination.mockResolvedValue(data)

      const result = await service.findAllWithPagination({
        paginationOptions: { page: 1, limit: 10 },
      })

      expect(repository.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result).toEqual(data)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no products exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])

      const result = await service.findAllWithPagination({
        paginationOptions: { page: 1, limit: 10 },
      })

      expect(result).toEqual([])
    })

    it('should forward pagination options correctly', async () => {
      repository.findAllWithPagination.mockResolvedValue([])

      await service.findAllWithPagination({
        paginationOptions: { page: 3, limit: 25 },
      })

      expect(repository.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 3, limit: 25 },
      })
    })
  })

  // ──────────────────────────────────────────────
  // findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the product by id', async () => {
      repository.findById.mockResolvedValue(mockProduct)

      const result = await service.findById(1)

      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(repository.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProduct)
    })

    it('should return null when product is not found', async () => {
      repository.findById.mockResolvedValue(null)

      const result = await service.findById(999)

      expect(repository.findById).toHaveBeenCalledWith(999)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // findByIds()
  // ──────────────────────────────────────────────
  describe('findByIds', () => {
    it('should return products by ids', async () => {
      const data = [mockProduct, mockProduct2]
      repository.findByIds.mockResolvedValue(data)

      const result = await service.findByIds([1, 2])

      expect(repository.findByIds).toHaveBeenCalledWith([1, 2])
      expect(result).toEqual(data)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no matching ids', async () => {
      repository.findByIds.mockResolvedValue([])

      const result = await service.findByIds([999])

      expect(result).toEqual([])
    })
  })

  // ──────────────────────────────────────────────
  // update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'iPhone 16 Pro Max' }
      const updated = { ...mockProduct, name: 'iPhone 16 Pro Max' }

      repository.update.mockResolvedValue(updated)

      const result = await service.update(1, dto)

      expect(repository.update).toHaveBeenCalledWith(1, {
        // Do not remove comment below.
        // <updating-property-payload />
      })
      expect(result).toEqual(updated)
    })

    it('should return null when updating a non-existent product', async () => {
      const dto: UpdateProductDto = { name: 'Non-existent' }

      repository.update.mockResolvedValue(null)

      const result = await service.update(999, dto)

      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a product by id', async () => {
      repository.remove.mockResolvedValue(undefined)

      const result = await service.remove(1)

      expect(repository.remove).toHaveBeenCalledWith(1)
      expect(repository.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

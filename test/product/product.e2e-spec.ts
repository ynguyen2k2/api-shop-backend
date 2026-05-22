import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from 'product/product.controller'
import { ProductService } from 'product/services/product.service'
import { ProductVariantService } from 'product/services/product-variant.service'
import { ProductImageService } from 'product/services/product-image.service'
import { ProductInventoryService } from 'product/services/product-inventory.service'
import { CreateProductDto } from 'product/dto/product/create-product.dto'
import { UpdateProductDto } from 'product/dto/product/update-product.dto'
import { Product } from 'product/domain/product'

// ──────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────

const now = new Date('2026-01-01T00:00:00Z')

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  shortDescription: 'Great product',
  images: [],
  specifications: null,
  slug: 'test-product',
  brand: 'TestBrand',
  category: 'electronics',
  variants: [],
  isActive: true,
  isFeatured: false,
  isNew: true,
  averageRating: 4.5,
  totalReviews: 10,
  createdAt: now,
  updatedAt: now,
}

const mockProduct2: Product = {
  id: 2,
  name: 'Another Product',
  description: 'Another great product',
  shortDescription: 'Another',
  images: [],
  specifications: 'Some specs',
  slug: 'another-product',
  brand: 'OtherBrand',
  category: 'clothing',
  variants: [],
  isActive: true,
  isFeatured: true,
  isNew: false,
  averageRating: 3.8,
  totalReviews: 5,
  createdAt: now,
  updatedAt: now,
}

// ──────────────────────────────────────────────
// Mock services
// ──────────────────────────────────────────────

const mockProductService = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  findByIds: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

const mockVariantService = {
  createVariant: jest.fn(),
  findById: jest.fn(),
  findProductVariants: jest.fn(),
  updateVariant: jest.fn(),
  removeVariant: jest.fn(),
}

const mockImageService = {
  attachImage: jest.fn(),
  removeImage: jest.fn(),
  reorderImages: jest.fn(),
}

const mockInventoryService = {
  createInventory: jest.fn(),
  findbyVariantId: jest.fn(),
  setStock: jest.fn(),
  increaseStock: jest.fn(),
  decreaseStock: jest.fn(),
  reserveStock: jest.fn(),
  releaseReservedStock: jest.fn(),
  validateAvailableStock: jest.fn(),
  removeInventory: jest.fn(),
}

describe('ProductController — Product CRUD', () => {
  let controller: ProductController
  let service: typeof mockProductService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ProductVariantService, useValue: mockVariantService },
        { provide: ProductImageService, useValue: mockImageService },
        { provide: ProductInventoryService, useValue: mockInventoryService },
      ],
    }).compile()

    controller = module.get<ProductController>(ProductController)
    service = mockProductService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /products  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create a product with required fields', async () => {
      const dto: CreateProductDto = {
        name: 'New Product',
        description: 'Description',
        shortDescription: 'Short desc',
        specifications: 'Specs',
        tags: ['tag1'],
        slug: 'new-product',
        brand: 'Brand',
        category: 'electronics',
        isActive: true,
        isFeatured: false,
        isNew: true,
        averageRating: 0,
        totalReviews: 0,
      }

      service.create.mockResolvedValue({
        ...mockProduct,
        name: dto.name,
        description: dto.description,
      })

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result.name).toBe('New Product')
    })

    it('should create a product with optional fields omitted', async () => {
      const dto: CreateProductDto = {
        name: 'Minimal Product',
        slug: 'minimal-product',
      } as CreateProductDto

      service.create.mockResolvedValue({
        ...mockProduct,
        name: dto.name,
        slug: dto.slug,
      })

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(result.name).toBe('Minimal Product')
    })
  })

  // ──────────────────────────────────────────────
  // GET /products  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated products', async () => {
      const data = [mockProduct, mockProduct2]
      service.findAllWithPagination.mockResolvedValue(data)

      const result = await controller.findAll({ page: 1, limit: 10 })

      expect(service.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toEqual(data)
      expect(result.hasNextPage).toBe(false)
    })

    it('should default to page 1 and limit 10 when query is empty', async () => {
      service.findAllWithPagination.mockResolvedValue([])

      const result = await controller.findAll({} as any)

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
        ...mockProduct,
        id: i + 1,
      }))
      service.findAllWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true)
    })
  })

  // ──────────────────────────────────────────────
  // GET /products/:id  →  findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return a product by id', async () => {
      service.findById.mockResolvedValue(mockProduct)

      const result = await controller.findById('1')

      expect(service.findById).toHaveBeenCalledWith('1')
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProduct)
    })

    it('should return null when product is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findById('999')

      expect(service.findById).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /products/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update product name', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product' }
      const updated = { ...mockProduct, name: 'Updated Product' }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith('1', dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result.name).toBe('Updated Product')
    })

    it('should update product active status', async () => {
      const dto: UpdateProductDto = { isActive: false }
      const updated = { ...mockProduct, isActive: false }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith('1', dto)
      expect(result.isActive).toBe(false)
    })

    it('should update product category and brand', async () => {
      const dto: UpdateProductDto = {
        category: 'fashion',
        brand: 'NewBrand',
      }
      const updated = {
        ...mockProduct,
        category: 'fashion',
        brand: 'NewBrand',
      }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('1', dto)

      expect(result.category).toBe('fashion')
      expect(result.brand).toBe('NewBrand')
    })

    it('should return null when product to update is not found', async () => {
      const dto: UpdateProductDto = { name: 'Ghost' }

      service.update.mockResolvedValue(null)

      const result = await controller.update('999', dto)

      expect(service.update).toHaveBeenCalledWith('999', dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /products/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a product by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove('1')

      expect(service.remove).toHaveBeenCalledWith('1')
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from 'product/product.controller'
import { ProductService } from 'product/services/product.service'
import { ProductVariantService } from 'product/services/product-variant.service'
import { ProductImageService } from 'product/services/product-image.service'
import { ProductInventoryService } from 'product/services/product-inventory.service'
import { CreateVariantDto } from 'product/dto/variant/create-variant.dto'
import { UpdateVariantDto } from 'product/dto/variant/update-variant.dto'
import { Variant } from 'product/domain/variant'
import { Product } from 'product/domain/product'

// ──────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────

const now = new Date('2026-01-01T00:00:00Z')

const mockProduct: Product = {
  id: 1,
  name: 'Test Product',
  description: 'A great product',
  shortDescription: 'Great',
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

const mockVariant: Variant = {
  id: 1,
  sku: 'SKU-TEST-001',
  inventory: null,
  price: 29.99,
  compareAtPrice: 39.99,
  product: mockProduct,
  createdAt: now,
  updatedAt: now,
  isActive: true,
}

const mockVariant2: Variant = {
  id: 2,
  sku: 'SKU-TEST-002',
  inventory: null,
  price: 49.99,
  compareAtPrice: 59.99,
  product: mockProduct,
  createdAt: now,
  updatedAt: now,
  isActive: true,
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

describe('ProductController — Variants', () => {
  let controller: ProductController
  let variantSvc: typeof mockVariantService

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
    variantSvc = mockVariantService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /products/:id/variants  →  addVariant()
  // ──────────────────────────────────────────────
  describe('addVariant', () => {
    it('should create a variant for a product', async () => {
      const dto: CreateVariantDto = {
        price: 29.99,
        stock: 100,
        compareAtPrice: 39.99,
      }

      variantSvc.createVariant.mockResolvedValue(mockVariant)

      const result = await controller.addVariant('1', dto)

      expect(variantSvc.createVariant).toHaveBeenCalledWith('1', dto)
      expect(variantSvc.createVariant).toHaveBeenCalledTimes(1)
      expect(result.sku).toBe('SKU-TEST-001')
      expect(result.price).toBe(29.99)
    })

    it('should create a variant with zero compare-at price', async () => {
      const dto: CreateVariantDto = {
        price: 10,
        stock: 50,
        compareAtPrice: 0,
      }

      variantSvc.createVariant.mockResolvedValue({
        ...mockVariant,
        price: 10,
        compareAtPrice: 0,
      })

      const result = await controller.addVariant('1', dto)

      expect(result.compareAtPrice).toBe(0)
    })
  })

  // ──────────────────────────────────────────────
  // GET /products/:id/variants  →  findProductVariants()
  // ──────────────────────────────────────────────
  describe('findProductVariants', () => {
    it('should return paginated variants for a product', async () => {
      const data = [mockVariant, mockVariant2]
      variantSvc.findProductVariants.mockResolvedValue(data)

      const result = await controller.findProductVariants('1', {
        page: 1,
        limit: 10,
      })

      expect(variantSvc.findProductVariants).toHaveBeenCalledWith({
        productId: '1',
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result).toEqual(data)
      expect(result).toHaveLength(2)
    })

    it('should default to page 1 and limit 10', async () => {
      variantSvc.findProductVariants.mockResolvedValue([])

      await controller.findProductVariants('1', {} as any)

      expect(variantSvc.findProductVariants).toHaveBeenCalledWith({
        productId: '1',
        paginationOptions: { page: 1, limit: 10 },
      })
    })
  })

  // ──────────────────────────────────────────────
  // GET /products/:id/variants/:variantId  →  findVariantById()
  // ──────────────────────────────────────────────
  describe('findVariantById', () => {
    it('should return a variant by id', async () => {
      variantSvc.findById.mockResolvedValue(mockVariant)

      const result = await controller.findVariantById('1', '1')

      expect(variantSvc.findById).toHaveBeenCalledWith('1')
      expect(variantSvc.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockVariant)
    })

    it('should return null when variant is not found', async () => {
      variantSvc.findById.mockResolvedValue(null)

      const result = await controller.findVariantById('1', '999')

      expect(variantSvc.findById).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /products/:id/variants/:variantId  →  updateVariant()
  // ──────────────────────────────────────────────
  describe('updateVariant', () => {
    it('should update variant price', async () => {
      const dto: UpdateVariantDto = { price: 19.99 }
      const updated = { ...mockVariant, price: 19.99 }

      variantSvc.updateVariant.mockResolvedValue(updated)

      const result = await controller.updateVariant('1', '1', dto)

      expect(variantSvc.updateVariant).toHaveBeenCalledWith('1', dto)
      expect(variantSvc.updateVariant).toHaveBeenCalledTimes(1)
      expect(result.price).toBe(19.99)
    })

    it('should update variant compareAtPrice', async () => {
      const dto: UpdateVariantDto = { compareAtPrice: 99.99 }
      const updated = { ...mockVariant, compareAtPrice: 99.99 }

      variantSvc.updateVariant.mockResolvedValue(updated)

      const result = await controller.updateVariant('1', '1', dto)

      expect(result.compareAtPrice).toBe(99.99)
    })

    it('should return null when variant to update is not found', async () => {
      const dto: UpdateVariantDto = { price: 10 }
      variantSvc.updateVariant.mockResolvedValue(null)

      const result = await controller.updateVariant('1', '999', dto)

      expect(variantSvc.updateVariant).toHaveBeenCalledWith('999', dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /products/:id/variants/:variantId  →  removeVariant()
  // ──────────────────────────────────────────────
  describe('removeVariant', () => {
    it('should remove a variant by id', async () => {
      variantSvc.removeVariant.mockResolvedValue(undefined)

      const result = await controller.removeVariant('1', '1')

      expect(variantSvc.removeVariant).toHaveBeenCalledWith('1')
      expect(variantSvc.removeVariant).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from 'product/product.controller'
import { ProductService } from 'product/services/product.service'
import { ProductVariantService } from 'product/services/product-variant.service'
import { ProductImageService } from 'product/services/product-image.service'
import { ProductInventoryService } from 'product/services/product-inventory.service'
import { ProductImage } from 'product/domain/product-image'
import { FileDto } from 'files/dto/file-dto'

// ──────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────

const now = new Date('2026-01-01T00:00:00Z')

const mockImage1: ProductImage = {
  id: 1,
  photo: { id: 'file-uuid-1', path: '/uploads/product-1.jpg' },
  product: null,
  order: 0,
  createdAt: now,
  updatedAt: now,
  isActive: true,
}

const mockImage2: ProductImage = {
  id: 2,
  photo: { id: 'file-uuid-2', path: '/uploads/product-2.jpg' },
  product: null,
  order: 1,
  createdAt: now,
  updatedAt: now,
  isActive: true,
}

const mockImage3: ProductImage = {
  id: 3,
  photo: { id: 'file-uuid-3', path: '/uploads/product-3.jpg' },
  product: null,
  order: 2,
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

describe('ProductController — Images', () => {
  let controller: ProductController
  let imageSvc: typeof mockImageService

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
    imageSvc = mockImageService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /products/:id/images  →  attachImage()
  // ──────────────────────────────────────────────
  describe('attachImage', () => {
    it('should attach an image to a product', async () => {
      const fileDto: FileDto = {
        id: 'file-uuid-1',
        path: '/uploads/product-1.jpg',
      }

      imageSvc.attachImage.mockResolvedValue(mockImage1)

      const result = await controller.attachImage('1', fileDto)

      expect(imageSvc.attachImage).toHaveBeenCalledWith('1', fileDto)
      expect(imageSvc.attachImage).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockImage1)
      expect(result.photo?.id).toBe('file-uuid-1')
    })

    it('should attach a second image with incremented order', async () => {
      const fileDto: FileDto = {
        id: 'file-uuid-2',
        path: '/uploads/product-2.jpg',
      }

      imageSvc.attachImage.mockResolvedValue(mockImage2)

      const result = await controller.attachImage('1', fileDto)

      expect(imageSvc.attachImage).toHaveBeenCalledWith('1', fileDto)
      expect(result.order).toBe(1)
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /products/:id/images/:imageId  →  removeImage()
  // ──────────────────────────────────────────────
  describe('removeImage', () => {
    it('should remove an image from a product', async () => {
      imageSvc.removeImage.mockResolvedValue({})

      const result = await controller.removeImage('1', '1')

      expect(imageSvc.removeImage).toHaveBeenCalledWith('1', '1')
      expect(imageSvc.removeImage).toHaveBeenCalledTimes(1)
      expect(result).toEqual({})
    })

    it('should call service with correct productId and imageId', async () => {
      imageSvc.removeImage.mockResolvedValue({})

      await controller.removeImage('5', '10')

      expect(imageSvc.removeImage).toHaveBeenCalledWith('5', '10')
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /products/:id/images/reorder  →  reorderImages()
  // ──────────────────────────────────────────────
  describe('reorderImages', () => {
    it('should reorder images by providing new order of ids', async () => {
      const reorderedImages = [
        { ...mockImage3, order: 0 },
        { ...mockImage1, order: 1 },
        { ...mockImage2, order: 2 },
      ]
      imageSvc.reorderImages.mockResolvedValue(reorderedImages)

      const imageIds = [3, 1, 2]
      const result = await controller.reorderImages('1', imageIds)

      expect(imageSvc.reorderImages).toHaveBeenCalledWith('1', imageIds)
      expect(imageSvc.reorderImages).toHaveBeenCalledTimes(1)
      expect(result[0].id).toBe(3)
      expect(result[0].order).toBe(0)
      expect(result[1].id).toBe(1)
      expect(result[1].order).toBe(1)
    })

    it('should handle single image reorder', async () => {
      imageSvc.reorderImages.mockResolvedValue([{ ...mockImage1, order: 0 }])

      const result = await controller.reorderImages('1', [1])

      expect(imageSvc.reorderImages).toHaveBeenCalledWith('1', [1])
      expect(result).toHaveLength(1)
    })

    it('should handle empty image array', async () => {
      imageSvc.reorderImages.mockResolvedValue(undefined)

      const result = await controller.reorderImages('1', [])

      expect(imageSvc.reorderImages).toHaveBeenCalledWith('1', [])
      expect(result).toBeUndefined()
    })
  })
})

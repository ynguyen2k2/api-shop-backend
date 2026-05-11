import { Test, TestingModule } from '@nestjs/testing'
import { ImageProductService } from '~/image-products/image-products.service'
import { ImageProductRepository } from '~/image-products/infrastructure/persistence/image-product.repository'
import { FilesService } from '~/files/file.service'
import { ProductsService } from '~/products/products.service'
import { ImageProduct } from '~/image-products/domain/image-product'
import { CreateImageProductDto } from '~/image-products/dto/create-image-product.dto'
import { UpdateImageProductDto } from '~/image-products/dto/update-image-product.dto'
import { FileType } from '~/files/domain/file'
import { Product } from '~/products/domain/product'

const mockFile: FileType = { id: 'file-1', path: 'https://example.com/photo.jpg' }

const mockProduct: Product = {
  id: 1, name: 'iPhone 16 Pro', slug: 'iphone-16-pro', brand: 'Apple',
  category: 'Smartphones', variants: [], isActive: true, isFeatured: true, isNew: true,
  averageRating: 4.8, totalReviews: 120,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'),
}

const mockImageProduct: ImageProduct = {
  id: 1, photo: mockFile, product: mockProduct, order: 1,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockImageProduct2: ImageProduct = {
  id: 2, photo: null, product: mockProduct, order: 2,
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockImageProductRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

const mockFilesService = { findById: jest.fn() }
const mockProductsService = { findById: jest.fn() }

describe('ImageProductService', () => {
  let service: ImageProductService
  let repository: typeof mockImageProductRepository
  let filesService: typeof mockFilesService
  let productsService: typeof mockProductsService

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageProductService,
        { provide: ImageProductRepository, useValue: mockImageProductRepository },
        { provide: FilesService, useValue: mockFilesService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile()
    service = module.get<ImageProductService>(ImageProductService)
    repository = mockImageProductRepository
    filesService = mockFilesService
    productsService = mockProductsService
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create an image product with photo and product', async () => {
      const dto: CreateImageProductDto = { photo: { id: 'file-1', path: '' }, product: { id: '1' }, order: 1 }
      filesService.findById.mockResolvedValue(mockFile)
      productsService.findById.mockResolvedValue(mockProduct)
      repository.create.mockResolvedValue(mockImageProduct)
      const result = await service.create(dto)
      expect(filesService.findById).toHaveBeenCalledWith('file-1')
      expect(productsService.findById).toHaveBeenCalledWith('1')
      expect(repository.create).toHaveBeenCalledWith({ photo: mockFile, product: mockProduct, order: 1 })
      expect(result).toEqual(mockImageProduct)
    })

    it('should create with null photo when photo is not provided', async () => {
      const dto: CreateImageProductDto = { product: { id: '1' }, order: 2 }
      productsService.findById.mockResolvedValue(mockProduct)
      repository.create.mockResolvedValue(mockImageProduct2)
      const result = await service.create(dto)
      expect(filesService.findById).not.toHaveBeenCalled()
      expect(repository.create).toHaveBeenCalledWith({ photo: null, product: mockProduct, order: 2 })
      expect(result).toEqual(mockImageProduct2)
    })

    it('should create with null product when product is not provided', async () => {
      const dto: CreateImageProductDto = { photo: { id: 'file-1', path: '' }, order: 1 }
      filesService.findById.mockResolvedValue(mockFile)
      repository.create.mockResolvedValue(mockImageProduct)
      await service.create(dto)
      expect(productsService.findById).not.toHaveBeenCalled()
      expect(repository.create).toHaveBeenCalledWith({ photo: mockFile, product: null, order: 1 })
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated image products', async () => {
      repository.findAllWithPagination.mockResolvedValue([mockImageProduct, mockImageProduct2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when none exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the image product by id', async () => {
      repository.findById.mockResolvedValue(mockImageProduct)
      const result = await service.findById(1)
      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockImageProduct)
    })

    it('should return null when not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return image products by ids', async () => {
      repository.findByIds.mockResolvedValue([mockImageProduct, mockImageProduct2])
      const result = await service.findByIds([1, 2])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update with new photo and product', async () => {
      const dto: UpdateImageProductDto = { photo: { id: 'file-1', path: '' }, product: { id: '1' }, order: 3 }
      filesService.findById.mockResolvedValue(mockFile)
      productsService.findById.mockResolvedValue(mockProduct)
      repository.update.mockResolvedValue({ ...mockImageProduct, order: 3 })
      const result = await service.update(1, dto)
      expect(filesService.findById).toHaveBeenCalledWith('file-1')
      expect(productsService.findById).toHaveBeenCalledWith('1')
      expect(repository.update).toHaveBeenCalledWith(1, { order: 3, photo: mockFile, product: mockProduct })
      expect(result).toBeDefined()
    })

    it('should update without changing photo or product when not provided', async () => {
      const dto: UpdateImageProductDto = { order: 5 }
      repository.update.mockResolvedValue({ ...mockImageProduct, order: 5 })
      await service.update(1, dto)
      expect(filesService.findById).not.toHaveBeenCalled()
      expect(productsService.findById).not.toHaveBeenCalled()
      expect(repository.update).toHaveBeenCalledWith(1, { order: 5, photo: null, product: null })
    })

    it('should return null when updating non-existent image product', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update(999, { order: 1 })
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove an image product by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove(1)
      expect(repository.remove).toHaveBeenCalledWith(1)
      expect(result).toBeUndefined()
    })
  })
})

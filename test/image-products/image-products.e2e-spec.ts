import { Test, TestingModule } from '@nestjs/testing'
import { ImageProductController } from '~/image-products/image-products.controller'
import { ImageProductService } from '~/image-products/image-products.service'
import { CreateImageProductDto } from '~/image-products/dto/create-image-product.dto'
import { UpdateImageProductDto } from '~/image-products/dto/update-image-product.dto'
import { ImageProduct } from '~/image-products/domain/image-product'

const mockImageProduct: ImageProduct = {
  id: 1,
  photo: null,
  product: null,
  order: 1,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockImageProduct2: ImageProduct = {
  id: 2,
  photo: null,
  product: null,
  order: 2,
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
  isActive: true,
}

const mockImageProductService = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('ImageProductController', () => {
  let controller: ImageProductController
  let service: typeof mockImageProductService

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageProductController],
      providers: [
        {
          provide: ImageProductService,
          useValue: mockImageProductService,
        },
      ],
    }).compile()

    controller = module.get<ImageProductController>(ImageProductController)
    service = mockImageProductService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /image-products  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create an image product', async () => {
      const dto: CreateImageProductDto = {
        order: 1,
        photo: { id: 'abc-123', path: '/uploads/photo.jpg' },
        product: { id: '10' },
      }

      service.create.mockResolvedValue(mockImageProduct)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockImageProduct)
    })

    it('should create an image product without optional fields', async () => {
      const dto: CreateImageProductDto = { order: 3 }

      service.create.mockResolvedValue({ ...mockImageProduct, order: 3 })

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(result.order).toBe(3)
    })
  })

  // ──────────────────────────────────────────────
  // GET /image-products  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated image products', async () => {
      const data = [mockImageProduct, mockImageProduct2]
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
        ...mockImageProduct,
        id: i + 1,
      }))
      service.findAllWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true) // 5 items === limit of 5
    })
  })

  // ──────────────────────────────────────────────
  // GET /image-products/:id  →  findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the image product by id', async () => {
      service.findById.mockResolvedValue(mockImageProduct)

      const result = await controller.findById('1')

      expect(service.findById).toHaveBeenCalledWith('1')
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockImageProduct)
    })

    it('should return null when image product is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findById('999')

      expect(service.findById).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /image-products/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update an image product', async () => {
      const dto: UpdateImageProductDto = { order: 5 }
      const updated = { ...mockImageProduct, order: 5 }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith('1', dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result!.order).toBe(5)
    })

    it('should update photo and product references', async () => {
      const dto: UpdateImageProductDto = {
        photo: { id: 'new-photo-id', path: '/uploads/new-photo.jpg' },
        product: { id: '20' },
      }

      service.update.mockResolvedValue({ ...mockImageProduct, ...dto })

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith('1', dto)
      expect(result!.photo).toEqual({ id: 'new-photo-id', path: '/uploads/new-photo.jpg' })
      expect(result!.product).toEqual({ id: '20' })
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /image-products/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove an image product by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove('1')

      expect(service.remove).toHaveBeenCalledWith('1')
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})


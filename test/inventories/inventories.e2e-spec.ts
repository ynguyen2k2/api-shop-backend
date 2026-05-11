import { Test, TestingModule } from '@nestjs/testing'
import { InventoryController } from '~/inventories/inventories.controller'
import { InventoryService } from '~/inventories/inventories.service'
import { CreateInventoryDto } from '~/inventories/dto/create-inventory.dto'
import { UpdateInventoryDto } from '~/inventories/dto/update-inventory.dto'
import { Inventory } from '~/inventories/domain/inventory'

const mockVariant = {
  id: 1,
  sku: 'SKU-IP16PRO-128',
  price: 999.99,
  compareAtPrice: 1099.99,
  product: {
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
  },
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockInventory: Inventory = {
  id: 1,
  variant: mockVariant as any,
  quantity: 100,
  reserved: 10,
  warehouse: 'WH-MAIN-01',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockInventory2: Inventory = {
  id: 2,
  variant: mockVariant as any,
  quantity: 50,
  reserved: 5,
  warehouse: 'WH-SOUTH-02',
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
  isActive: true,
}

const mockInventoryService = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('InventoryController', () => {
  let controller: InventoryController
  let service: typeof mockInventoryService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile()

    controller = module.get<InventoryController>(InventoryController)
    service = mockInventoryService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /inventories  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create an inventory and return it', async () => {
      const dto: CreateInventoryDto = {}

      service.create.mockResolvedValue(mockInventory)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockInventory)
    })

    it('should return the created inventory with correct properties', async () => {
      const dto: CreateInventoryDto = {}

      service.create.mockResolvedValue(mockInventory)

      const result = await controller.create(dto)

      expect(result.quantity).toBe(100)
      expect(result.reserved).toBe(10)
      expect(result.warehouse).toBe('WH-MAIN-01')
      expect(result.isActive).toBe(true)
    })

    it('should return inventory with variant relation', async () => {
      const dto: CreateInventoryDto = {}

      service.create.mockResolvedValue(mockInventory)

      const result = await controller.create(dto)

      expect(result.variant).toBeDefined()
      expect(result.variant.sku).toBe('SKU-IP16PRO-128')
      expect(result.variant.price).toBe(999.99)
    })
  })

  // ──────────────────────────────────────────────
  // GET /inventories  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated inventories', async () => {
      const data = [mockInventory, mockInventory2]
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
        ...mockInventory,
        id: i + 1,
      }))
      service.findAllWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true) // 5 items === limit of 5
    })

    it('should handle page 2 correctly', async () => {
      service.findAllWithPagination.mockResolvedValue([mockInventory2])

      const result = await controller.findAll({ page: 2, limit: 1 })

      expect(service.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 2, limit: 1 },
      })
      expect(result.data).toHaveLength(1)
      expect(result.hasNextPage).toBe(true)
    })

    it('should return different warehouse inventories', async () => {
      const data = [mockInventory, mockInventory2]
      service.findAllWithPagination.mockResolvedValue(data)

      const result = await controller.findAll({ page: 1, limit: 10 })

      expect(result.data[0].warehouse).toBe('WH-MAIN-01')
      expect(result.data[1].warehouse).toBe('WH-SOUTH-02')
    })
  })

  // ──────────────────────────────────────────────
  // GET /inventories/:id  →  findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the inventory by id', async () => {
      service.findById.mockResolvedValue(mockInventory)

      const result = await controller.findById('1')

      expect(service.findById).toHaveBeenCalledWith('1')
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockInventory)
    })

    it('should return null when inventory is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findById('999')

      expect(service.findById).toHaveBeenCalledWith('999')
      expect(result).toBeNull()
    })

    it('should return inventory with all fields', async () => {
      service.findById.mockResolvedValue(mockInventory)

      const result = await controller.findById('1')

      expect(result.quantity).toBe(100)
      expect(result.reserved).toBe(10)
      expect(result.warehouse).toBe('WH-MAIN-01')
      expect(result.isActive).toBe(true)
      expect(result.variant).toBeDefined()
      expect(result.createdAt).toEqual(new Date('2026-01-01'))
      expect(result.updatedAt).toEqual(new Date('2026-01-01'))
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /inventories/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update an inventory', async () => {
      const dto: UpdateInventoryDto = {}
      const updated = { ...mockInventory }

      service.update.mockResolvedValue(updated)

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith('1', dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result).toEqual(updated)
    })

    it('should return null when updating a non-existent inventory', async () => {
      const dto: UpdateInventoryDto = {}

      service.update.mockResolvedValue(null)

      const result = await controller.update('999', dto)

      expect(service.update).toHaveBeenCalledWith('999', dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /inventories/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove an inventory by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove('1')

      expect(service.remove).toHaveBeenCalledWith('1')
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})


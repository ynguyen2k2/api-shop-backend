import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from 'product/product.controller'
import { ProductService } from 'product/services/product.service'
import { ProductVariantService } from 'product/services/product-variant.service'
import { ProductImageService } from 'product/services/product-image.service'
import { ProductInventoryService } from 'product/services/product-inventory.service'
import { CreateInventoryDto } from 'product/dto/inventory/create-inventory.dto'
import { Inventory } from 'product/domain/inventory'
import { Variant } from 'product/domain/variant'

// ──────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────

const now = new Date('2026-01-01T00:00:00Z')

const mockVariant: Variant = {
  id: 1,
  sku: 'SKU-TEST-001',
  inventory: null,
  price: 29.99,
  compareAtPrice: 39.99,
  product: {} as any,
  createdAt: now,
  updatedAt: now,
  isActive: true,
}

const mockInventory: Inventory = {
  id: 1,
  variant: mockVariant,
  quantity: 100,
  reserved: 10,
  warehouse: 'WH-MAIN-01',
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

describe('ProductController — Inventory', () => {
  let controller: ProductController
  let inventorySvc: typeof mockInventoryService

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
    inventorySvc = mockInventoryService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST …/variants/:variantId/inventory  →  createInventory()
  // ──────────────────────────────────────────────
  describe('createInventory', () => {
    it('should create inventory for a variant', async () => {
      const dto: CreateInventoryDto = {
        quantity: 100,
        reserved: 0,
        warehouse: 'WH-MAIN-01',
      }

      inventorySvc.createInventory.mockResolvedValue(mockInventory)

      const result = await controller.createInventory('1', '1', dto)

      expect(inventorySvc.createInventory).toHaveBeenCalledWith({
        variantId: '1',
        createInventoryDto: dto,
      })
      expect(inventorySvc.createInventory).toHaveBeenCalledTimes(1)
      expect(result.quantity).toBe(100)
      expect(result.warehouse).toBe('WH-MAIN-01')
    })

    it('should create inventory with reserved quantity', async () => {
      const dto: CreateInventoryDto = {
        quantity: 50,
        reserved: 10,
        warehouse: 'WH-SEC-02',
      }

      const inventoryWithReserved = {
        ...mockInventory,
        quantity: 50,
        reserved: 10,
        warehouse: 'WH-SEC-02',
      }
      inventorySvc.createInventory.mockResolvedValue(inventoryWithReserved)

      const result = await controller.createInventory('1', '2', dto)

      expect(inventorySvc.createInventory).toHaveBeenCalledWith({
        variantId: '2',
        createInventoryDto: dto,
      })
      expect(result.reserved).toBe(10)
      expect(result.warehouse).toBe('WH-SEC-02')
    })
  })

  // ──────────────────────────────────────────────
  // GET …/variants/:variantId/inventory  →  findVariantInventory()
  // ──────────────────────────────────────────────
  describe('findVariantInventory', () => {
    it('should return inventory for a variant', async () => {
      inventorySvc.findbyVariantId.mockResolvedValue(mockInventory)

      const result = await controller.findVariantInventory('1', '1')

      expect(inventorySvc.findbyVariantId).toHaveBeenCalledWith('1')
      expect(inventorySvc.findbyVariantId).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockInventory)
      expect(result.quantity).toBe(100)
    })
  })

  // ──────────────────────────────────────────────
  // PATCH …/inventory/set-stock  →  setStock()
  // ──────────────────────────────────────────────
  describe('setStock', () => {
    it('should set absolute stock quantity', async () => {
      const updatedInventory = { ...mockInventory, quantity: 200 }
      inventorySvc.setStock.mockResolvedValue(updatedInventory)

      const result = await controller.setStock('1', '1', 200)

      expect(inventorySvc.setStock).toHaveBeenCalledWith('1', 200)
      expect(inventorySvc.setStock).toHaveBeenCalledTimes(1)
      expect(result.quantity).toBe(200)
    })

    it('should set stock to zero', async () => {
      const updatedInventory = { ...mockInventory, quantity: 0 }
      inventorySvc.setStock.mockResolvedValue(updatedInventory)

      const result = await controller.setStock('1', '1', 0)

      expect(inventorySvc.setStock).toHaveBeenCalledWith('1', 0)
      expect(result.quantity).toBe(0)
    })
  })

  // ──────────────────────────────────────────────
  // PATCH …/inventory/increase-stock  →  increaseStock()
  // ──────────────────────────────────────────────
  describe('increaseStock', () => {
    it('should increase stock by a given quantity', async () => {
      const updatedInventory = { ...mockInventory, quantity: 150 }
      inventorySvc.increaseStock.mockResolvedValue(updatedInventory)

      const result = await controller.increaseStock('1', '1', 50)

      expect(inventorySvc.increaseStock).toHaveBeenCalledWith('1', 50)
      expect(inventorySvc.increaseStock).toHaveBeenCalledTimes(1)
      expect(result.quantity).toBe(150)
    })
  })

  // ──────────────────────────────────────────────
  // PATCH …/inventory/decrease-stock  →  decreaseStock()
  // ──────────────────────────────────────────────
  describe('decreaseStock', () => {
    it('should decrease stock by a given quantity', async () => {
      const updatedInventory = { ...mockInventory, quantity: 80 }
      inventorySvc.decreaseStock.mockResolvedValue(updatedInventory)

      const result = await controller.decreaseStock('1', '1', 20)

      expect(inventorySvc.decreaseStock).toHaveBeenCalledWith('1', 20)
      expect(inventorySvc.decreaseStock).toHaveBeenCalledTimes(1)
      expect(result.quantity).toBe(80)
    })
  })

  // ──────────────────────────────────────────────
  // PATCH …/inventory/reserve  →  reserveStock()
  // ──────────────────────────────────────────────
  describe('reserveStock', () => {
    it('should reserve stock for an order', async () => {
      const updatedInventory = { ...mockInventory, reserved: 15 }
      inventorySvc.reserveStock.mockResolvedValue(updatedInventory)

      const result = await controller.reserveStock('1', '1', 5)

      expect(inventorySvc.reserveStock).toHaveBeenCalledWith('1', 5)
      expect(inventorySvc.reserveStock).toHaveBeenCalledTimes(1)
      expect(result.reserved).toBe(15)
    })

    it('should handle large reservation quantities', async () => {
      const updatedInventory = { ...mockInventory, reserved: 90 }
      inventorySvc.reserveStock.mockResolvedValue(updatedInventory)

      const result = await controller.reserveStock('1', '1', 80)

      expect(inventorySvc.reserveStock).toHaveBeenCalledWith('1', 80)
      expect(result.reserved).toBe(90)
    })
  })

  // ──────────────────────────────────────────────
  // PATCH …/inventory/release  →  releaseReservedStock()
  // ──────────────────────────────────────────────
  describe('releaseReservedStock', () => {
    it('should release reserved stock', async () => {
      const updatedInventory = { ...mockInventory, reserved: 5 }
      inventorySvc.releaseReservedStock.mockResolvedValue(updatedInventory)

      const result = await controller.releaseReservedStock('1', '1', 5)

      expect(inventorySvc.releaseReservedStock).toHaveBeenCalledWith('1', 5)
      expect(inventorySvc.releaseReservedStock).toHaveBeenCalledTimes(1)
      expect(result.reserved).toBe(5)
    })

    it('should release all reserved stock', async () => {
      const updatedInventory = { ...mockInventory, reserved: 0 }
      inventorySvc.releaseReservedStock.mockResolvedValue(updatedInventory)

      const result = await controller.releaseReservedStock('1', '1', 10)

      expect(inventorySvc.releaseReservedStock).toHaveBeenCalledWith('1', 10)
      expect(result.reserved).toBe(0)
    })
  })

  // ──────────────────────────────────────────────
  // DELETE …/variants/:variantId/inventory  →  removeInventory()
  // ──────────────────────────────────────────────
  describe('removeInventory', () => {
    it('should remove inventory for a variant', async () => {
      inventorySvc.removeInventory.mockResolvedValue(undefined)

      const result = await controller.removeInventory('1', '1')

      expect(inventorySvc.removeInventory).toHaveBeenCalledWith('1')
      expect(inventorySvc.removeInventory).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

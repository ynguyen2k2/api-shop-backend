import { Test, TestingModule } from '@nestjs/testing'
import { InventoryService } from '~/inventories/inventories.service'
import { InventoryRepository } from '~/inventories/infrastructure/persistence/inventory.repository'
import { Inventory } from '~/inventories/domain/inventory'
import { CreateInventoryDto } from '~/inventories/dto/create-inventory.dto'
import { UpdateInventoryDto } from '~/inventories/dto/update-inventory.dto'

const mockInventory: Inventory = {
  id: 1, variant: { id: 1, sku: 'SKU-001' } as any,
  quantity: 100, reserved: 10, warehouse: 'WH-MAIN-01',
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockInventory2: Inventory = {
  id: 2, variant: { id: 1, sku: 'SKU-001' } as any,
  quantity: 50, reserved: 5, warehouse: 'WH-SOUTH-02',
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockInventoryRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

describe('InventoryService', () => {
  let service: InventoryService
  let repository: typeof mockInventoryRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: InventoryRepository, useValue: mockInventoryRepository },
      ],
    }).compile()
    service = module.get<InventoryService>(InventoryService)
    repository = mockInventoryRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create an inventory', async () => {
      const dto: CreateInventoryDto = {}
      repository.create.mockResolvedValue(mockInventory)
      const result = await service.create(dto)
      expect(repository.create).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockInventory)
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated inventories', async () => {
      repository.findAllWithPagination.mockResolvedValue([mockInventory, mockInventory2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no inventories exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the inventory by id', async () => {
      repository.findById.mockResolvedValue(mockInventory)
      const result = await service.findById(1)
      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockInventory)
    })

    it('should return null when inventory is not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return inventories by ids', async () => {
      repository.findByIds.mockResolvedValue([mockInventory, mockInventory2])
      const result = await service.findByIds([1, 2])
      expect(repository.findByIds).toHaveBeenCalledWith([1, 2])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update an inventory', async () => {
      const dto: UpdateInventoryDto = {}
      repository.update.mockResolvedValue({ ...mockInventory, quantity: 200 })
      const result = await service.update(1, dto)
      expect(repository.update).toHaveBeenCalledWith(1, {})
      expect(result).toBeDefined()
    })

    it('should return null when updating non-existent inventory', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update(999, {})
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove an inventory by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove(1)
      expect(repository.remove).toHaveBeenCalledWith(1)
      expect(result).toBeUndefined()
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { AttributesService } from '~/attributes/attributes.service'
import { AttributeRepository } from '~/attributes/infrastructure/persistence/attribute.repository'
import { AttributeValuesService } from '~/attribute-values/attribute-values.service'
import { Attribute } from '~/attributes/domain/attribute'
import { CreateAttributeDto } from '~/attributes/dto/create-attribute.dto'
import { UpdateAttributeDto } from '~/attributes/dto/update-attribute.dto'

const mockAttribute: Attribute = {
  id: 1, name: 'Color', slug: 'color', type: 'select',
  values: [{ id: 1, value: 'Red', attribute: {} as any, createdAt: new Date(), updatedAt: new Date() }],
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockAttribute2: Attribute = {
  id: 2, name: 'Size', slug: 'size', type: 'select',
  values: [{ id: 2, value: 'XL', attribute: {} as any, createdAt: new Date(), updatedAt: new Date() }],
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockAttributeRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

const mockAttributeValuesService = { create: jest.fn() }

describe('AttributesService', () => {
  let service: AttributesService
  let repository: typeof mockAttributeRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributesService,
        { provide: AttributeRepository, useValue: mockAttributeRepository },
        { provide: AttributeValuesService, useValue: mockAttributeValuesService },
      ],
    }).compile()
    service = module.get<AttributesService>(AttributesService)
    repository = mockAttributeRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create an attribute with slugified name and mapped values', async () => {
      const dto: CreateAttributeDto = { name: 'Color', slug: '', type: 'select', values: ['Red', 'Blue'], categoryId: '' }
      repository.create.mockResolvedValue(mockAttribute)
      const result = await service.create(dto)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Color', slug: 'color', type: 'select' }))
      const callArgs = repository.create.mock.calls[0][0]
      expect(callArgs.values).toHaveLength(2)
      expect(callArgs.values[0].value).toBe('Red')
      expect(callArgs.values[1].value).toBe('Blue')
      expect(result).toEqual(mockAttribute)
    })

    it('should generate correct slug from attribute name', async () => {
      const dto: CreateAttributeDto = { name: 'Screen Size', slug: '', type: 'text', values: [], categoryId: '' }
      repository.create.mockResolvedValue(mockAttribute)
      await service.create(dto)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'screen-size' }))
    })

    it('should handle empty values array', async () => {
      const dto: CreateAttributeDto = { name: 'Weight', slug: '', type: 'number', values: undefined as any, categoryId: '' }
      repository.create.mockResolvedValue(mockAttribute)
      await service.create(dto)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ values: undefined }))
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated attributes', async () => {
      repository.findAllWithPagination.mockResolvedValue([mockAttribute, mockAttribute2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no attributes exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the attribute by id', async () => {
      repository.findById.mockResolvedValue(mockAttribute)
      const result = await service.findById(1)
      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockAttribute)
    })

    it('should return null when attribute is not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return attributes by ids', async () => {
      repository.findByIds.mockResolvedValue([mockAttribute, mockAttribute2])
      const result = await service.findByIds([1, 2])
      expect(repository.findByIds).toHaveBeenCalledWith([1, 2])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update an attribute with new slug when name changes', async () => {
      const dto: UpdateAttributeDto = { name: 'Updated Color', values: ['Green'] }
      const updated = { ...mockAttribute, name: 'Updated Color', slug: 'updated-color' }
      repository.update.mockResolvedValue(updated)
      const result = await service.update(1, dto)
      expect(repository.update).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Updated Color', slug: 'updated-color' }))
      const callArgs = repository.update.mock.calls[0][1]
      expect(callArgs.values).toHaveLength(1)
      expect(callArgs.values[0].value).toBe('Green')
      expect(result).toEqual(updated)
    })

    it('should not regenerate slug when name is not provided', async () => {
      const dto: UpdateAttributeDto = { type: 'text' }
      repository.update.mockResolvedValue({ ...mockAttribute, type: 'text' })
      await service.update(1, dto)
      expect(repository.update).toHaveBeenCalledWith(1, expect.objectContaining({ slug: undefined }))
    })

    it('should return null when updating non-existent attribute', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update(999, { name: 'X' })
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove an attribute by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove(1)
      expect(repository.remove).toHaveBeenCalledWith(1)
      expect(result).toBeUndefined()
    })
  })
})

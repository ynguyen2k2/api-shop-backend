import { Test, TestingModule } from '@nestjs/testing'
import { AttributeValuesService } from '~/attribute-values/attribute-values.service'
import { AttributeValueRepository } from '~/attribute-values/infrastructure/persistence/attribute-value.repository'
import { AttributeRepository } from '~/attributes/infrastructure/persistence/attribute.repository'
import { AttributeValue } from '~/attribute-values/domain/attribute-value'
import { Attribute } from '~/attributes/domain/attribute'
import { CreateAttributeValueDto } from '~/attribute-values/dto/create-attribute-value.dto'
import { UpdateAttributeValueDto } from '~/attribute-values/dto/update-attribute-value.dto'

const mockAttribute: Attribute = {
  id: 1, name: 'Color', slug: 'color', type: 'select',
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockAttrValue: AttributeValue = {
  id: 1, value: 'Red', attribute: mockAttribute,
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockAttrValue2: AttributeValue = {
  id: 2, value: 'Blue', attribute: mockAttribute,
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockAttrValueRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

const mockAttributeRepository = { findById: jest.fn() }

describe('AttributeValuesService', () => {
  let service: AttributeValuesService
  let attrValueRepo: typeof mockAttrValueRepository
  let attrRepo: typeof mockAttributeRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttributeValuesService,
        { provide: AttributeValueRepository, useValue: mockAttrValueRepository },
        { provide: AttributeRepository, useValue: mockAttributeRepository },
      ],
    }).compile()
    service = module.get<AttributeValuesService>(AttributeValuesService)
    attrValueRepo = mockAttrValueRepository
    attrRepo = mockAttributeRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create an attribute value when attribute exists', async () => {
      const dto: CreateAttributeValueDto = { value: 'Red', attributeId: '1' }
      attrRepo.findById.mockResolvedValue(mockAttribute)
      attrValueRepo.create.mockResolvedValue(mockAttrValue)
      const result = await service.create(dto)
      expect(attrRepo.findById).toHaveBeenCalledWith('1')
      expect(attrValueRepo.create).toHaveBeenCalledWith({ value: 'Red', attribute: mockAttribute })
      expect(result).toEqual(mockAttrValue)
    })

    it('should throw when attributeId is not provided', async () => {
      const dto = { value: 'Red' } as CreateAttributeValueDto
      await expect(service.create(dto)).rejects.toThrow('Attribute id is required')
      expect(attrValueRepo.create).not.toHaveBeenCalled()
    })

    it('should throw when attribute is not found', async () => {
      const dto: CreateAttributeValueDto = { value: 'Red', attributeId: '999' }
      attrRepo.findById.mockResolvedValue(null)
      await expect(service.create(dto)).rejects.toThrow('Attribute not found')
      expect(attrValueRepo.create).not.toHaveBeenCalled()
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated attribute values', async () => {
      attrValueRepo.findAllWithPagination.mockResolvedValue([mockAttrValue, mockAttrValue2])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(attrValueRepo.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toHaveLength(2)
    })

    it('should return empty array when none exist', async () => {
      attrValueRepo.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the attribute value by id', async () => {
      attrValueRepo.findById.mockResolvedValue(mockAttrValue)
      const result = await service.findById(1)
      expect(attrValueRepo.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockAttrValue)
    })

    it('should return null when not found', async () => {
      attrValueRepo.findById.mockResolvedValue(null)
      const result = await service.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return attribute values by ids', async () => {
      attrValueRepo.findByIds.mockResolvedValue([mockAttrValue, mockAttrValue2])
      const result = await service.findByIds([1, 2])
      expect(attrValueRepo.findByIds).toHaveBeenCalledWith([1, 2])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update an attribute value', async () => {
      const dto: UpdateAttributeValueDto = {}
      attrValueRepo.update.mockResolvedValue(mockAttrValue)
      const result = await service.update(1, dto)
      expect(attrValueRepo.update).toHaveBeenCalledWith(1, {})
      expect(result).toEqual(mockAttrValue)
    })

    it('should return null when updating non-existent value', async () => {
      attrValueRepo.update.mockResolvedValue(null)
      const result = await service.update(999, {})
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove an attribute value by id', async () => {
      attrValueRepo.remove.mockResolvedValue(undefined)
      const result = await service.remove(1)
      expect(attrValueRepo.remove).toHaveBeenCalledWith(1)
      expect(result).toBeUndefined()
    })
  })
})

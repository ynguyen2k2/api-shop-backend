import { Test, TestingModule } from '@nestjs/testing'
import { CategoriesService } from '~/categories/categories.service'
import { CategoryRepository } from '~/categories/infrastructure/persistence/category.repository'
import { Category } from '~/categories/domain/category'
import { CreateCategoryDto } from '~/categories/dto/create-category.dto'
import { UpdateCategoryDto } from '~/categories/dto/update-category.dto'

const mockParentCategory: Category = {
  id: 1, name: 'Electronics', slug: 'electronics', description: 'All electronics',
  image: 'electronics.jpg', parent: null, children: [],
  createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01'), isActive: true,
}

const mockChildCategory: Category = {
  id: 2, name: 'Smartphones', slug: 'smartphones', description: 'All smartphones',
  image: null, parent: mockParentCategory, children: null,
  createdAt: new Date('2026-01-02'), updatedAt: new Date('2026-01-02'), isActive: true,
}

const mockChildCategory2: Category = {
  id: 3, name: 'Laptops', slug: 'laptops', description: 'All laptops',
  image: null, parent: mockParentCategory, children: null,
  createdAt: new Date('2026-01-03'), updatedAt: new Date('2026-01-03'), isActive: true,
}

const mockCategoryRepository = {
  create: jest.fn(), findAllWithPagination: jest.fn(), findById: jest.fn(),
  findByIds: jest.fn(), update: jest.fn(), remove: jest.fn(),
}

describe('CategoriesService', () => {
  let service: CategoriesService
  let repository: typeof mockCategoryRepository

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoryRepository, useValue: mockCategoryRepository },
      ],
    }).compile()
    service = module.get<CategoriesService>(CategoriesService)
    repository = mockCategoryRepository
  })

  it('should be defined', () => { expect(service).toBeDefined() })

  describe('create', () => {
    it('should create a category without parent or children', async () => {
      const dto = { name: 'Electronics', slug: 'electronics', description: 'All electronics', image: 'electronics.jpg', isActive: true } as CreateCategoryDto
      repository.create.mockResolvedValue(mockParentCategory)
      const result = await service.create(dto)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Electronics', slug: 'electronics', parent: null, children: null }))
      expect(result).toEqual(mockParentCategory)
    })

    it('should auto-generate slug from name when slug is not provided', async () => {
      const dto = { name: 'Home Appliances' } as CreateCategoryDto
      repository.create.mockResolvedValue(mockParentCategory)
      await service.create(dto)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'home-appliances' }))
    })

    it('should create a category with a parent', async () => {
      const dto = { name: 'Smartphones', slug: 'smartphones', parentId: 1 } as CreateCategoryDto
      repository.findById.mockResolvedValue(mockParentCategory)
      repository.create.mockResolvedValue(mockChildCategory)
      const result = await service.create(dto)
      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ parent: mockParentCategory }))
      expect(result).toEqual(mockChildCategory)
    })

    it('should throw when parent category is not found', async () => {
      const dto = { name: 'Smartphones', slug: 'smartphones', parentId: 999 } as CreateCategoryDto
      repository.findById.mockResolvedValue(null)
      await expect(service.create(dto)).rejects.toThrow('Parent category not found')
      expect(repository.create).not.toHaveBeenCalled()
    })

    it('should create a category with children', async () => {
      const dto = { name: 'Electronics', slug: 'electronics', childrenIds: [2, 3] } as CreateCategoryDto
      repository.findByIds.mockResolvedValue([mockChildCategory, mockChildCategory2])
      repository.create.mockResolvedValue(mockParentCategory)
      await service.create(dto)
      expect(repository.findByIds).toHaveBeenCalledWith([2, 3])
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ children: [mockChildCategory, mockChildCategory2] }))
    })

    it('should throw when child categories are not found', async () => {
      const dto = { name: 'Electronics', slug: 'electronics', childrenIds: [999] } as CreateCategoryDto
      repository.findByIds.mockResolvedValue(null)
      await expect(service.create(dto)).rejects.toThrow('Child categories not found')
    })

    it('should default isActive to true when not provided', async () => {
      const dto = { name: 'Test', slug: 'test' } as CreateCategoryDto
      repository.create.mockResolvedValue(mockParentCategory)
      await service.create(dto)
      expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ isActive: true }))
    })
  })

  describe('findAllWithPagination', () => {
    it('should return paginated categories', async () => {
      const data = [mockParentCategory, mockChildCategory]
      repository.findAllWithPagination.mockResolvedValue(data)
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(repository.findAllWithPagination).toHaveBeenCalledWith({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual(data)
    })

    it('should return empty array when no categories exist', async () => {
      repository.findAllWithPagination.mockResolvedValue([])
      const result = await service.findAllWithPagination({ paginationOptions: { page: 1, limit: 10 } })
      expect(result).toEqual([])
    })
  })

  describe('findById', () => {
    it('should return the category by id', async () => {
      repository.findById.mockResolvedValue(mockParentCategory)
      const result = await service.findById(1)
      expect(repository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockParentCategory)
    })

    it('should return null when category is not found', async () => {
      repository.findById.mockResolvedValue(null)
      const result = await service.findById(999)
      expect(result).toBeNull()
    })
  })

  describe('findByIds', () => {
    it('should return categories by ids', async () => {
      repository.findByIds.mockResolvedValue([mockChildCategory, mockChildCategory2])
      const result = await service.findByIds([2, 3])
      expect(repository.findByIds).toHaveBeenCalledWith([2, 3])
      expect(result).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('should update category name', async () => {
      const dto: UpdateCategoryDto = { name: 'Updated Electronics' }
      repository.update.mockResolvedValue({ ...mockParentCategory, name: 'Updated Electronics' })
      const result = await service.update(1, dto)
      expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated Electronics' })
      expect(result!.name).toBe('Updated Electronics')
    })

    it('should update parent by parentId', async () => {
      const dto: UpdateCategoryDto = { parentId: 1 }
      repository.update.mockResolvedValue(mockChildCategory)
      await service.update(2, dto)
      expect(repository.update).toHaveBeenCalledWith(2, { parent: { id: 1 } })
    })

    it('should set parent to null when parentId is falsy', async () => {
      const dto: UpdateCategoryDto = { parentId: 0 }
      repository.update.mockResolvedValue({ ...mockChildCategory, parent: null })
      await service.update(2, dto)
      expect(repository.update).toHaveBeenCalledWith(2, { parent: null })
    })

    it('should return null when updating non-existent category', async () => {
      repository.update.mockResolvedValue(null)
      const result = await service.update(999, { name: 'X' })
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should remove a category by id', async () => {
      repository.remove.mockResolvedValue(undefined)
      const result = await service.remove(1)
      expect(repository.remove).toHaveBeenCalledWith(1)
      expect(result).toBeUndefined()
    })
  })
})

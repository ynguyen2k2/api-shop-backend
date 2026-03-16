import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryRepository } from './infrastructure/persistence/category.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Category } from './domain/category'
import { NullableType } from '~/utils/type/nullable.type'

@Injectable()
export class CategoriesService {
  constructor(
    // Dependencies here
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Do not remove comment below.
    // <creating-property />
    let slug = createCategoryDto.slug
    let parentCategory: NullableType<Category> = null
    let childCategories: NullableType<Category[]> = null
    if (!slug) {
      slug = createCategoryDto.name.toLowerCase().replace(/ /g, '-')
    }

    const parentId = createCategoryDto.parentId
      ? createCategoryDto.parentId
      : null
    if (parentId) {
      parentCategory = await this.categoryRepository.findById(parentId)
      ///error handler
      if (!parentCategory) {
        throw new Error('Parent category not found')
      }
    }
    const childrenCategoryIds = createCategoryDto.childrenIds
    if (childrenCategoryIds) {
      childCategories =
        await this.categoryRepository.findByIds(childrenCategoryIds)
      if (!childCategories) {
        throw new Error('Child categories not found')
      }
    }
    return this.categoryRepository.create({
      name: createCategoryDto.name,
      slug,
      description: createCategoryDto.description ?? null,
      image: createCategoryDto.image ?? null,
      isActive: createCategoryDto.isActive ?? true,
      parent: parentCategory,
      children: childCategories,
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.categoryRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: Category['id']) {
    return this.categoryRepository.findById(id)
  }

  findByIds(ids: Category['id'][]) {
    return this.categoryRepository.findByIds(ids)
  }

  async update(id: Category['id'], updateCategoryDto: UpdateCategoryDto) {
    // Do not remove comment below.
    // <updating-property />

    const payload: Partial<Category> = {}
    if (updateCategoryDto.name !== undefined)
      payload.name = updateCategoryDto.name
    if (updateCategoryDto.slug !== undefined)
      payload.slug = updateCategoryDto.slug
    if (updateCategoryDto.description !== undefined)
      payload.description = updateCategoryDto.description
    if (updateCategoryDto.image !== undefined)
      payload.image = updateCategoryDto.image
    if (updateCategoryDto.isActive !== undefined)
      payload.isActive = updateCategoryDto.isActive
    if (updateCategoryDto.parentId !== undefined) {
      payload.parent = updateCategoryDto.parentId
        ? ({ id: updateCategoryDto.parentId } as Category)
        : null
    }
    // Do not remove comment below.
    // <updating-property-payload />

    return this.categoryRepository.update(id, payload)
  }

  remove(id: Category['id']) {
    return this.categoryRepository.remove(id)
  }
}

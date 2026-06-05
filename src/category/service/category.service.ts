import {
  HttpStatus,
  // common
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UpdateCategoryDto } from '../dto/category/update-category.dto'
import { IPaginationOptions } from 'src/utils/type/pagination-options'
import { Category } from '../domain/category'
import { NullableType } from 'src/utils/type/nullable.type'
import { CategoryRepository } from 'src/category/domain/repositories/category.repository'
import { CreateCategoryDto } from 'src/category/dto/category/create-category.dto'

@Injectable()
export class CategoryService {
  constructor(
    // Dependencies here
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Do not remove comment below.
    // <creating-property />
    const slug = createCategoryDto.name.toLowerCase().replace(/ /g, '-')
    let parentCategory: NullableType<Category> = null
    let childcategory: NullableType<Category[]> = null
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
      childcategory =
        await this.categoryRepository.findByIds(childrenCategoryIds)
      if (!childcategory) {
        throw new Error('Child category not found')
      }
    }
    return this.categoryRepository.create({
      name: createCategoryDto.name,
      slug,
      description: createCategoryDto.description ?? null,
      image: createCategoryDto.image ?? null,
      isActive: createCategoryDto.isActive ?? true,
      parent: parentCategory,
      children: childcategory,
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
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'cartNotFound',
        },
      })
    }
    const slug: string | undefined = updateCategoryDto.name
      ? updateCategoryDto.name.toLowerCase().replace(/ /g, '-')
      : undefined

    return this.categoryRepository.update(id, { ...updateCategoryDto, slug })
  }

  remove(id: Category['id']) {
    return this.categoryRepository.remove(id)
  }
}

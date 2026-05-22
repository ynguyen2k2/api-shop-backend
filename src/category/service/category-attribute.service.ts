import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { AttributeService } from 'src/attribute/attribute.service'
import { CategoryAttributeRepository } from 'src/category/domain/repositories/category-attribute.respository'
import { CategoryDto } from 'src/category/dto/category/category.dto'
import { CreateCategoryAttributeDto } from 'src/category/dto/category-attribute/create-category-attribute.dto'
import { CategoryService } from 'src/category/service/category.service'
import { CategoryAttribute } from 'src/category/domain/category-attribute'
import { UpdateCategoryAttributeDto } from 'src/category/dto/category-attribute/upate-category-attribute.dto'
import { IPaginationOptions } from 'src/utils/type/pagination-options'

@Injectable()
export class CategoryAttributeService {
  constructor(
    private readonly categoryAttributeRepository: CategoryAttributeRepository,
    private readonly categoryService: CategoryService,
    private readonly attributeService: AttributeService,
  ) {}
  async create(
    categoryId: CategoryDto['id'],
    createCategoryAttributeDto: CreateCategoryAttributeDto,
  ) {
    const category = await this.categoryService.findById(categoryId)
    if (!category) {
      throw new NotFoundException({
        HTTPStatus: HttpStatus.NOT_FOUND,
        message: 'CategorynotExists',
      })
    }
    const attribute = await this.attributeService.findById(
      createCategoryAttributeDto.attributeId,
    )
    if (!attribute) {
      throw new NotFoundException({
        HTTPStatus: HttpStatus.NOT_FOUND,
        message: 'AttributeNotExists',
      })
    }
    return this.categoryAttributeRepository.create({
      ...createCategoryAttributeDto,
      attribute,
      category,
    })
  }

  async findById(id: CategoryAttribute['id']) {
    return await this.categoryAttributeRepository.findById(id)
  }
  async findByIds(ids: CategoryAttribute['id'][]) {
    return await this.categoryAttributeRepository.findByIds(ids)
  }
  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return await this.categoryAttributeRepository.findAllWithPagination({
      paginationOptions,
    })
  }

  //update attribute of category
  async update(
    id: CategoryAttribute['id'],
    categoryId: CategoryDto['id'],
    updateCategoryAttributeDto: UpdateCategoryAttributeDto,
  ) {
    const categoryAttribute =
      await this.categoryAttributeRepository.findById(id)

    if (!categoryAttribute) {
      throw new NotFoundException({
        message: 'CategoryAttributeNotExists',
      })
    }

    if (categoryAttribute.category.id !== categoryId) {
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'CategoryAttributeDoesNotBelongToCategory',
      })
    }

    if (updateCategoryAttributeDto.attributeId) {
      const attribute = await this.attributeService.findById(
        updateCategoryAttributeDto.attributeId,
      )
      if (!attribute) {
        throw new NotFoundException({
          HTTPStatus: HttpStatus.NOT_FOUND,
          message: 'AttributeNotExists',
        })
      }

      if (categoryAttribute.attribute.id === attribute.id) {
        throw new UnprocessableEntityException({
          HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'CategoryAttributeDoesBelongToAttribute',
        })
      }
    }

    return this.categoryAttributeRepository.update(id, {
      ...updateCategoryAttributeDto,
    })
  }
  remove(id: CategoryAttribute['id']) {
    return this.categoryAttributeRepository.remove(id)
  }
}

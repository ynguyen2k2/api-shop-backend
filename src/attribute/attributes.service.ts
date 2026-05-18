import {
  BadRequestException,
  ConflictException,
  // common
  Injectable,
} from '@nestjs/common'
import { CreateAttributeDto } from './dto/attribute/create-attribute.dto'
import { UpdateAttributeDto } from './dto/attribute/update-attribute.dto'
import { AttributeRepository } from './domain/respositories/attribute.repository'
import { IPaginationOptions } from '../utils/type/pagination-options'
import { Attribute } from './domain/attribute'
import slugify from '~/utils/slugify'

import { CategoryRepository } from '~/categories/infrastructure/persistence/category.repository'
import { AttributeValueRepository } from '~/attribute/domain/respositories/attribute-value.repository'
import { CreateAttributeValueDto } from '~/attribute/dto/value/create-attribute-value.dto'
import { AttributeValue } from '~/attribute/domain/attribute-value'

@Injectable()
export class AttributesService {
  constructor(
    // Dependencies here
    private readonly attributeRepository: AttributeRepository,
    private readonly attributeValueRepository: AttributeValueRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createAttributeDto: CreateAttributeDto) {
    const slug = slugify(createAttributeDto.name)
    const existingAttribute = await this.attributeRepository.findBySlug(slug)
    if (existingAttribute) {
      throw new BadRequestException('Attribute already exists')
    }

    const category = await this.categoryRepository.findById(
      createAttributeDto.categoryId,
    )
    if (!category) {
      throw new BadRequestException('Category not found')
    }

    return this.attributeRepository.create({
      name: createAttributeDto.name,
      slug,
      type: createAttributeDto.type,
      category,
    })
  }

  async createAttributeValues(
    attributeId: Attribute['id'],
    createAttributeValues: CreateAttributeValueDto,
  ) {
    const attribute = await this.attributeRepository.findById(attributeId)
    if (!attribute) {
      throw new BadRequestException('Attribute not found')
    }

    const existingValue = await this.attributeValueRepository.findByValue(
      createAttributeValues.value,
    )
    if (existingValue) {
      throw new ConflictException('Attribute value already exists')
    }
    return this.attributeValueRepository.create({
      ...createAttributeValues,
      attribute,
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.attributeRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: Attribute['id']) {
    return this.attributeRepository.findById(id)
  }

  findByIds(ids: Attribute['id'][]) {
    return this.attributeRepository.findByIds(ids)
  }

  async findAttributeValue(attributeId: Attribute['id']) {
    const attribute = await this.attributeRepository.findById(attributeId)
    if (!attribute) {
      throw new BadRequestException('Attribute not found')
    }
    return this.attributeValueRepository.findByAttributeId(attributeId)
  }

  readonly INVALID_FIELDS_UPDATED = ['values']

  async update(id: Attribute['id'], updateAttributeDto: UpdateAttributeDto) {
    Object.keys(updateAttributeDto).forEach((key) => {
      if (this.INVALID_FIELDS_UPDATED.includes(key)) {
        delete updateAttributeDto[key]
      }
    })
    const attribute = await this.attributeRepository.findById(id)
    if (!attribute) {
      throw new BadRequestException('Attribute not found')
    }
    if (updateAttributeDto.name) {
      const slug = slugify(updateAttributeDto.name)
      const existingAttribute = await this.attributeRepository.findBySlug(slug)
      if (existingAttribute) {
        throw new BadRequestException('Attribute already exists')
      }
      updateAttributeDto.slug = slug
    }
    Object.keys(updateAttributeDto).forEach((key) => {
      if (updateAttributeDto[key] === undefined) {
        delete updateAttributeDto[key]
      }
    })

    return this.attributeRepository.update(id, updateAttributeDto)
  }

  remove(id: Attribute['id']) {
    return this.attributeRepository.remove(id)
  }

  async removeAttributeValue(
    attributeId: Attribute['id'],
    valueId: AttributeValue['id'],
  ) {
    const attribute = await this.attributeRepository.findById(attributeId)
    if (!attribute) {
      throw new BadRequestException('Attribute not found')
    }
    const value = await this.attributeValueRepository.findById(valueId)
    if (!value) {
      throw new BadRequestException('Value not found')
    }

    if (value.attribute.id !== attributeId) {
      throw new BadRequestException('Value not found in attribute')
    }
    return this.attributeValueRepository.remove(valueId)
  }
}

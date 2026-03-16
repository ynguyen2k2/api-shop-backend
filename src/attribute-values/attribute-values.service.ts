import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto'
import { AttributeValueRepository } from './infrastructure/persistence/attribute-value.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { AttributeValue } from './domain/attribute-value'
import { AttributeRepository } from '~/attributes/infrastructure/persistence/attribute.repository'

@Injectable()
export class AttributeValuesService {
  constructor(
    // Dependencies here
    private readonly attributeValueRepository: AttributeValueRepository,
    private readonly attributeRepository: AttributeRepository,
  ) {}

  async create(createAttributeValueDto: CreateAttributeValueDto) {
    if (!createAttributeValueDto.attributeId) {
      throw new Error('Attribute id is required')
    }
    const attribute = await this.attributeRepository.findById(
      createAttributeValueDto.attributeId,
    )
    if (!attribute) {
      throw new Error('Attribute not found')
    }
    return this.attributeValueRepository.create({
      value: createAttributeValueDto.value,
      attribute: attribute,
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.attributeValueRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: AttributeValue['id']) {
    return this.attributeValueRepository.findById(id)
  }

  findByIds(ids: AttributeValue['id'][]) {
    return this.attributeValueRepository.findByIds(ids)
  }

  async update(
    id: AttributeValue['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.attributeValueRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: AttributeValue['id']) {
    return this.attributeValueRepository.remove(id)
  }
}

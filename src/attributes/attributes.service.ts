import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'
import { AttributeRepository } from './infrastructure/persistence/attribute.repository'
import { IPaginationOptions } from '../utils/type/pagination-options'
import { Attribute } from './domain/attribute'
import slugify from '~/utils/slugify'
import { AttributeValuesService } from '~/attribute-values/attribute-values.service'
import { AttributeValue } from '~/attribute-values/domain/attribute-value'

@Injectable()
export class AttributesService {
  constructor(
    // Dependencies here
    private readonly attributeValueService: AttributeValuesService,
    private readonly attributeRepository: AttributeRepository,
  ) {}

  async create(createAttributeDto: CreateAttributeDto) {
    const slug = slugify(createAttributeDto.name)
    const values = createAttributeDto.values?.map((value) => {
      const attributeValue = new AttributeValue()
      attributeValue.value = value
      return attributeValue
    })

    return this.attributeRepository.create({
      name: createAttributeDto.name,
      slug: slug,
      type: createAttributeDto.type,
      values,
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

  async update(
    id: Attribute['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateAttributeDto: UpdateAttributeDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    const slug = updateAttributeDto.name
      ? slugify(updateAttributeDto.name)
      : undefined

    const values = updateAttributeDto.values?.map((value) => {
      const attributeValue = new AttributeValue()
      attributeValue.value = value
      return attributeValue
    })

    return this.attributeRepository.update(id, {
      name: updateAttributeDto.name,
      slug,
      type: updateAttributeDto.type,
    })
  }

  remove(id: Attribute['id']) {
    return this.attributeRepository.remove(id)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { AttributeValueEntity } from '../entities/attribute-value.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { AttributeValueRepository } from '~/attribute/domain/respositories/attribute-value.repository'
import { AttributeValueMapper } from '../mappers/attribute-value.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { AttributeValue } from '~/attribute/domain/attribute-value'
import { Attribute } from '~/attribute/domain/attribute'

@Injectable()
export class AttributeValueRelationalRepository
  implements AttributeValueRepository
{
  constructor(
    @InjectRepository(AttributeValueEntity)
    private readonly attributeValueRepository: Repository<AttributeValueEntity>,
  ) {}

  async create(data: AttributeValue): Promise<AttributeValue> {
    const persistenceModel = AttributeValueMapper.toPersistence(data)
    const newEntity = await this.attributeValueRepository.save(
      this.attributeValueRepository.create(persistenceModel),
    )
    return AttributeValueMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<AttributeValue[]> {
    const entities = await this.attributeValueRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => AttributeValueMapper.toDomain(entity))
  }

  async findById(
    id: AttributeValue['id'],
  ): Promise<NullableType<AttributeValue>> {
    const entity = await this.attributeValueRepository.findOne({
      where: { id },
    })

    return entity ? AttributeValueMapper.toDomain(entity) : null
  }

  async findByIds(ids: AttributeValue['id'][]): Promise<AttributeValue[]> {
    const entities = await this.attributeValueRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => AttributeValueMapper.toDomain(entity))
  }

  async findByAttributeId(
    attributeId: Attribute['id'],
  ): Promise<AttributeValue[]> {
    const entities = await this.attributeValueRepository.find({
      where: { attribute: { id: attributeId } },
    })

    return entities.map((entity) => AttributeValueMapper.toDomain(entity))
  }

  async findByValue(
    value: AttributeValue['value'],
  ): Promise<NullableType<AttributeValue>> {
    const entity = await this.attributeValueRepository.findOne({
      where: { value },
    })

    return entity ? AttributeValueMapper.toDomain(entity) : null
  }

  async update(
    id: AttributeValue['id'],
    payload: Partial<AttributeValue>,
  ): Promise<AttributeValue> {
    const entity = await this.attributeValueRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.attributeValueRepository.save(
      this.attributeValueRepository.create(
        AttributeValueMapper.toPersistence({
          ...AttributeValueMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return AttributeValueMapper.toDomain(updatedEntity)
  }

  async remove(id: AttributeValue['id']): Promise<void> {
    await this.attributeValueRepository.delete(id)
  }
}

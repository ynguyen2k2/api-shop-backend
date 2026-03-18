import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { AttributeEntity } from '../entities/attribute.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { Attribute } from '~/attributes/domain/attribute'
import { AttributeRepository } from '~/attributes/infrastructure/persistence/attribute.repository'
import { AttributeMapper } from '../mappers/attribute.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class AttributeRelationalRepository implements AttributeRepository {
  constructor(
    @InjectRepository(AttributeEntity)
    private readonly attributeRepository: Repository<AttributeEntity>,
  ) {}

  async create(data: Attribute): Promise<Attribute> {
    const persistenceModel = AttributeMapper.toPersistence(data)
    const newEntity = await this.attributeRepository.save(
      this.attributeRepository.create(persistenceModel),
    )
    return AttributeMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Attribute[]> {
    const entities = await this.attributeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => AttributeMapper.toDomain(entity))
  }

  async findById(id: Attribute['id']): Promise<NullableType<Attribute>> {
    const entity = await this.attributeRepository.findOne({
      where: { id },
      relations: ['attributeValues'],
    })

    return entity ? AttributeMapper.toDomain(entity) : null
  }

  async findByIds(ids: Attribute['id'][]): Promise<Attribute[]> {
    const entities = await this.attributeRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => AttributeMapper.toDomain(entity))
  }

  async update(
    id: Attribute['id'],
    payload: Partial<Attribute>,
  ): Promise<Attribute> {
    const entity = await this.attributeRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.attributeRepository.save(
      this.attributeRepository.create(
        AttributeMapper.toPersistence({
          ...AttributeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return AttributeMapper.toDomain(updatedEntity)
  }

  async remove(id: Attribute['id']): Promise<void> {
    await this.attributeRepository.delete(id)
  }
}

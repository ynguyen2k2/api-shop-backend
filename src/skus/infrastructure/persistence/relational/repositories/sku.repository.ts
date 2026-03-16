import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { skuEntity } from '../entities/sku.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { sku } from '~/skus/domain/sku'
import { skuRepository } from '~/skus/infrastructure/persistence/sku.repository'
import { skuMapper } from '../mappers/sku.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class skuRelationalRepository implements skuRepository {
  constructor(
    @InjectRepository(skuEntity)
    private readonly skuRepository: Repository<skuEntity>,
  ) {}

  async create(data: sku): Promise<sku> {
    const persistenceModel = skuMapper.toPersistence(data)
    const newEntity = await this.skuRepository.save(
      this.skuRepository.create(persistenceModel),
    )
    return skuMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<sku[]> {
    const entities = await this.skuRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => skuMapper.toDomain(entity))
  }

  async findById(id: sku['id']): Promise<NullableType<sku>> {
    const entity = await this.skuRepository.findOne({
      where: { id },
    })

    return entity ? skuMapper.toDomain(entity) : null
  }

  async findByIds(ids: sku['id'][]): Promise<sku[]> {
    const entities = await this.skuRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => skuMapper.toDomain(entity))
  }

  async update(id: sku['id'], payload: Partial<sku>): Promise<sku> {
    const entity = await this.skuRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.skuRepository.save(
      this.skuRepository.create(
        skuMapper.toPersistence({
          ...skuMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return skuMapper.toDomain(updatedEntity)
  }

  async remove(id: sku['id']): Promise<void> {
    await this.skuRepository.delete(id)
  }
}

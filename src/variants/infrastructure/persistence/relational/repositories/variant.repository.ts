import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { VariantEntity } from '../entities/variant.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { Variant } from '~/variants/domain/variant'
import { VariantRepository } from '~/variants/infrastructure/persistence/variant.repository'
import { VariantMapper } from '../mappers/variant.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class VariantRelationalRepository implements VariantRepository {
  constructor(
    @InjectRepository(VariantEntity)
    private readonly variantRepository: Repository<VariantEntity>,
  ) {}

  async create(data: Variant): Promise<Variant> {
    const persistenceModel = VariantMapper.toPersistence(data)
    const newEntity = await this.variantRepository.save(
      this.variantRepository.create(persistenceModel),
    )
    return VariantMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Variant[]> {
    const entities = await this.variantRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => VariantMapper.toDomain(entity))
  }

  async findById(id: Variant['id']): Promise<NullableType<Variant>> {
    const entity = await this.variantRepository.findOne({
      where: { id },
    })

    return entity ? VariantMapper.toDomain(entity) : null
  }

  async findByIds(ids: Variant['id'][]): Promise<Variant[]> {
    const entities = await this.variantRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => VariantMapper.toDomain(entity))
  }

  async update(id: Variant['id'], payload: Partial<Variant>): Promise<Variant> {
    const entity = await this.variantRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.variantRepository.save(
      this.variantRepository.create(
        VariantMapper.toPersistence({
          ...VariantMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return VariantMapper.toDomain(updatedEntity)
  }

  async remove(id: Variant['id']): Promise<void> {
    await this.variantRepository.delete(id)
  }
}

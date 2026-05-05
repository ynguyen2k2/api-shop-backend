import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { productImageEntity } from '../entities/product-image.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { productImage } from '~/product-images/domain/product-image'
import { productImageRepository } from '~/product-images/infrastructure/persistence/product-image.repository'
import { productImageMapper } from '../mappers/product-image.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class productImageRelationalRepository
  implements productImageRepository
{
  constructor(
    @InjectRepository(productImageEntity)
    private readonly productImageRepository: Repository<productImageEntity>,
  ) {}

  async create(data: productImage): Promise<productImage> {
    const persistenceModel = productImageMapper.toPersistence(data)
    const newEntity = await this.productImageRepository.save(
      this.productImageRepository.create(persistenceModel),
    )
    return productImageMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<productImage[]> {
    const entities = await this.productImageRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => productImageMapper.toDomain(entity))
  }

  async findById(id: productImage['id']): Promise<NullableType<productImage>> {
    const entity = await this.productImageRepository.findOne({
      where: { id },
    })

    return entity ? productImageMapper.toDomain(entity) : null
  }

  async findByIds(ids: productImage['id'][]): Promise<productImage[]> {
    const entities = await this.productImageRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => productImageMapper.toDomain(entity))
  }

  async update(
    id: productImage['id'],
    payload: Partial<productImage>,
  ): Promise<productImage> {
    const entity = await this.productImageRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.productImageRepository.save(
      this.productImageRepository.create(
        productImageMapper.toPersistence({
          ...productImageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return productImageMapper.toDomain(updatedEntity)
  }

  async remove(id: productImage['id']): Promise<void> {
    await this.productImageRepository.delete(id)
  }
}

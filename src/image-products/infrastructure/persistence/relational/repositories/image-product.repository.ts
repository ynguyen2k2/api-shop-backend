import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { imageProductEntity } from '../entities/image-product.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { imageProduct } from '~/image-products/domain/image-product'
import { imageProductRepository } from '~/image-products/infrastructure/persistence/image-product.repository'
import { imageProductMapper } from '../mappers/image-product.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class imageProductRelationalRepository
  implements imageProductRepository
{
  constructor(
    @InjectRepository(imageProductEntity)
    private readonly imageProductRepository: Repository<imageProductEntity>,
  ) {}

  async create(data: imageProduct): Promise<imageProduct> {
    const persistenceModel = imageProductMapper.toPersistence(data)
    const newEntity = await this.imageProductRepository.save(
      this.imageProductRepository.create(persistenceModel),
    )
    return imageProductMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<imageProduct[]> {
    const entities = await this.imageProductRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => imageProductMapper.toDomain(entity))
  }

  async findById(id: imageProduct['id']): Promise<NullableType<imageProduct>> {
    const entity = await this.imageProductRepository.findOne({
      where: { id },
    })

    return entity ? imageProductMapper.toDomain(entity) : null
  }

  async findByIds(ids: imageProduct['id'][]): Promise<imageProduct[]> {
    const entities = await this.imageProductRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => imageProductMapper.toDomain(entity))
  }

  async update(
    id: imageProduct['id'],
    payload: Partial<imageProduct>,
  ): Promise<imageProduct> {
    const entity = await this.imageProductRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.imageProductRepository.save(
      this.imageProductRepository.create(
        imageProductMapper.toPersistence({
          ...imageProductMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return imageProductMapper.toDomain(updatedEntity)
  }

  async remove(id: imageProduct['id']): Promise<void> {
    await this.imageProductRepository.delete(id)
  }
}

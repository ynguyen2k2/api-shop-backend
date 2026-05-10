import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { ImageProductEntity } from '../entities/image-product.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { ImageProduct } from '~/image-products/domain/image-product'
import { ImageProductRepository } from '~/image-products/infrastructure/persistence/image-product.repository'
import { ImageProductMapper } from '../mappers/image-product.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class ImageProductRelationalRepository
  implements ImageProductRepository
{
  constructor(
    @InjectRepository(ImageProductEntity)
    private readonly imageProductRepository: Repository<ImageProductEntity>,
  ) {}

  async create(data: ImageProduct): Promise<ImageProduct> {
    const persistenceModel = ImageProductMapper.toPersistence(data)
    const newEntity = await this.imageProductRepository.save(
      this.imageProductRepository.create(persistenceModel),
    )
    return ImageProductMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<ImageProduct[]> {
    const entities = await this.imageProductRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => ImageProductMapper.toDomain(entity))
  }

  async findById(id: ImageProduct['id']): Promise<NullableType<ImageProduct>> {
    const entity = await this.imageProductRepository.findOne({
      where: { id },
    })

    return entity ? ImageProductMapper.toDomain(entity) : null
  }

  async findByIds(ids: ImageProduct['id'][]): Promise<ImageProduct[]> {
    const entities = await this.imageProductRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => ImageProductMapper.toDomain(entity))
  }

  async update(
    id: ImageProduct['id'],
    payload: Partial<ImageProduct>,
  ): Promise<ImageProduct> {
    const entity = await this.imageProductRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.imageProductRepository.save(
      this.imageProductRepository.create(
        ImageProductMapper.toPersistence({
          ...ImageProductMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return ImageProductMapper.toDomain(updatedEntity)
  }

  async remove(id: ImageProduct['id']): Promise<void> {
    await this.imageProductRepository.delete(id)
  }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryAttribute } from 'category/domain/category-attribute'
import { CategoryAttributeRepository } from 'category/domain/repositories/category-attribute.respository'
import { CategoryAttributeEntity } from 'category/infrastructure/persistence/relational/entities/category-attribute.entity'
import { CategoryAttributeMapper } from 'category/infrastructure/persistence/relational/mappers/category-attribute.mapper'
import { In, Repository } from 'typeorm'
import { NullableType } from 'utils/type/nullable.type'
import { IPaginationOptions } from 'utils/type/pagination-options'

@Injectable()
export class CategoryAttributeRelationalRepository
  implements CategoryAttributeRepository
{
  constructor(
    @InjectRepository(CategoryAttributeEntity)
    private readonly categoryAttributeRepository: Repository<CategoryAttributeEntity>,
  ) {}
  async create(data: CategoryAttribute): Promise<CategoryAttribute> {
    const persistenceModel = CategoryAttributeMapper.toPersistence(data)
    const newEntity = await this.categoryAttributeRepository.save(
      this.categoryAttributeRepository.create(persistenceModel),
    )
    return CategoryAttributeMapper.toDomain(newEntity)
  }
  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<CategoryAttribute[]> {
    throw new Error('Method not implemented.')
  }
  async findById(
    id: CategoryAttribute['id'],
  ): Promise<NullableType<CategoryAttribute>> {
    const entity = await this.categoryAttributeRepository.findOne({
      where: { id },
      relations: ['category', 'attribute'],
    })
    return entity ? CategoryAttributeMapper.toDomain(entity) : null
  }
  async findByIds(
    ids: CategoryAttribute['id'][],
  ): Promise<CategoryAttribute[]> {
    const entities = await this.categoryAttributeRepository.find({
      where: {
        id: In(ids),
      },

      relations: ['category', 'attribute'],
    })
    return entities.map((entity) => CategoryAttributeMapper.toDomain(entity))
  }
  async update(
    id: CategoryAttribute['id'],
    payload: Partial<CategoryAttribute>,
  ): Promise<CategoryAttribute | null> {
    const entity = await this.categoryAttributeRepository.findOne({
      where: { id },
    })
    if (!entity) {
      throw new Error('Record not found')
    }
    const domainEntity = CategoryAttributeMapper.toDomain(entity)
    const mergeredPayload = {
      ...domainEntity,
      ...payload,
    }

    const updatedEntity = await this.categoryAttributeRepository.save(
      this.categoryAttributeRepository.create(
        CategoryAttributeMapper.toPersistence({
          ...mergeredPayload,
        }),
      ),
    )

    return CategoryAttributeMapper.toDomain(updatedEntity)
  }
  async remove(id: CategoryAttribute['id']): Promise<void> {
    await this.categoryAttributeRepository.delete(id)
  }
}

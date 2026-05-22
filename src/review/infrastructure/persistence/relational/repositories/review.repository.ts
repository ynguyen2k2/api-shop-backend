import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { ReviewEntity } from '../entities/review.entity'
import { NullableType } from 'src/utils/type/nullable.type'
import { Review } from 'src/review/domain/review'
import { ReviewRepository } from 'src/review/domain/repositories/review.repository'
import { ReviewMapper } from '../mappers/review.mapper'
import { IPaginationOptions } from 'src/utils/type/pagination-options'
import { Product } from 'src/product/domain/product'
import { User } from 'src/user/domain/user'

@Injectable()
export class ReviewRelationalRepository implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(data: Review): Promise<Review> {
    const persistenceModel = ReviewMapper.toPersistence(data)
    const newEntity = await this.reviewRepository.save(
      this.reviewRepository.create(persistenceModel),
    )
    return ReviewMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => ReviewMapper.toDomain(entity))
  }

  async findById(id: Review['id']): Promise<NullableType<Review>> {
    const entity = await this.reviewRepository.findOne({
      where: { id },
    })

    return entity ? ReviewMapper.toDomain(entity) : null
  }

  async findByIds(ids: Review['id'][]): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => ReviewMapper.toDomain(entity))
  }

  async findAllByProductId({
    productId,
    paginationOptions,
  }: {
    productId: Product['id']
    paginationOptions: IPaginationOptions
  }): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: { user: true, product: true },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => ReviewMapper.toDomain(entity))
  }

  async findAllByUserId({
    userId,
    paginationOptions,
  }: {
    userId: User['id']
    paginationOptions: IPaginationOptions
  }): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, product: true },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => ReviewMapper.toDomain(entity))
  }
  async findUserAndProduct(
    userId: User['id'],
    productId: Product['id'],
  ): Promise<NullableType<Review>> {
    const entity = await this.reviewRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: { user: true, product: true },
    })

    return entity ? ReviewMapper.toDomain(entity) : null
  }

  async update(id: Review['id'], payload: Partial<Review>): Promise<Review> {
    const entity = await this.reviewRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.reviewRepository.save(
      this.reviewRepository.create(
        ReviewMapper.toPersistence({
          ...ReviewMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return ReviewMapper.toDomain(updatedEntity)
  }

  async remove(id: Review['id']): Promise<void> {
    await this.reviewRepository.delete(id)
  }
}

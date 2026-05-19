import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { CartEntity } from '../entities/cart.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { Cart } from '~/cart/domain/cart'
import { CartRepository } from '~/cart/domain/respositories/cart.repository'
import { CartMapper } from '../mappers/cart.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class CartRelationalRepository implements CartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async create(data: Cart): Promise<Cart> {
    const persistenceModel = CartMapper.toPersistence(data)
    const newEntity = await this.cartRepository.save(
      this.cartRepository.create(persistenceModel),
    )
    return CartMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<Cart[]> {
    const entities = await this.cartRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => CartMapper.toDomain(entity))
  }

  async findById(id: Cart['id']): Promise<NullableType<Cart>> {
    const entity = await this.cartRepository.findOne({
      where: { id },
    })

    return entity ? CartMapper.toDomain(entity) : null
  }

  async findByIds(ids: Cart['id'][]): Promise<Cart[]> {
    const entities = await this.cartRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => CartMapper.toDomain(entity))
  }

  async update(id: Cart['id'], payload: Partial<Cart>): Promise<Cart> {
    const entity = await this.cartRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.cartRepository.save(
      this.cartRepository.create(
        CartMapper.toPersistence({
          ...CartMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return CartMapper.toDomain(updatedEntity)
  }

  async remove(id: Cart['id']): Promise<void> {
    await this.cartRepository.delete(id)
  }
}

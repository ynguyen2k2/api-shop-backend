import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { CartItemEntity } from '../entities/cart-item.entity'
import { NullableType } from '~/utils/type/nullable.type'
import { CartItem } from '~/cart-items/domain/cart-item'
import { CartItemRepository } from '~/cart-items/infrastructure/persistence/cart-item.repository'
import { CartItemMapper } from '../mappers/cart-item.mapper'
import { IPaginationOptions } from '~/utils/type/pagination-options'

@Injectable()
export class CartItemRelationalRepository implements CartItemRepository {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  async create(data: CartItem): Promise<CartItem> {
    const persistenceModel = CartItemMapper.toPersistence(data)
    const newEntity = await this.cartItemRepository.save(
      this.cartItemRepository.create(persistenceModel),
    )
    return CartItemMapper.toDomain(newEntity)
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }): Promise<CartItem[]> {
    const entities = await this.cartItemRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    })

    return entities.map((entity) => CartItemMapper.toDomain(entity))
  }

  async findById(id: CartItem['id']): Promise<NullableType<CartItem>> {
    const entity = await this.cartItemRepository.findOne({
      where: { id },
    })

    return entity ? CartItemMapper.toDomain(entity) : null
  }

  async findByIds(ids: CartItem['id'][]): Promise<CartItem[]> {
    const entities = await this.cartItemRepository.find({
      where: { id: In(ids) },
    })

    return entities.map((entity) => CartItemMapper.toDomain(entity))
  }

  async update(
    id: CartItem['id'],
    payload: Partial<CartItem>,
  ): Promise<CartItem> {
    const entity = await this.cartItemRepository.findOne({
      where: { id },
    })

    if (!entity) {
      throw new Error('Record not found')
    }

    const updatedEntity = await this.cartItemRepository.save(
      this.cartItemRepository.create(
        CartItemMapper.toPersistence({
          ...CartItemMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return CartItemMapper.toDomain(updatedEntity)
  }

  async remove(id: CartItem['id']): Promise<void> {
    await this.cartItemRepository.delete(id)
  }
}

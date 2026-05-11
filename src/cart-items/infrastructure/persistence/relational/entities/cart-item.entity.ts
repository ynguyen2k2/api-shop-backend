import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CartEntity } from '~/carts/infrastructure/persistence/relational/entities/cart.entity'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'
import { VariantEntity } from '~/variants/infrastructure/persistence/relational/entities/variant.entity'

@Entity({
  name: 'cart_item',
})
export class CartItemEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @ManyToOne(() => CartEntity, { nullable: false })
  cart: CartEntity

  @ManyToOne(() => VariantEntity, { nullable: false })
  @JoinColumn({ name: 'variant_id' })
  variant: VariantEntity

  @Column()
  quantity: number

  @Column()
  priceSnapshot: number

  @Column()
  comparePriceSnapshot: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

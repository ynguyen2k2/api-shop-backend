import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Product } from '~/products/domain/product'
import { ProductEntity } from '~/products/infrastructure/persistence/relational/entities/product.entity'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'

@Entity({
  name: 'variant',
})
export class VariantEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @Column({})
  sku: string

  @Column()
  price: number

  @Column()
  stock: number
  @Column()
  compareAtPrice: number

  @ManyToOne(() => ProductEntity, (product) => product.variants)
  product: ProductEntity

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

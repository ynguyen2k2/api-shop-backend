import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductEntity } from 'product/infrastructure/persistence/relational/entities/product.entity'
import { EntityRelationalHelper } from 'utils/relational-entity-helper'
import { InventoryEntity } from 'product/infrastructure/persistence/relational/entities/inventory.entity'
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

  @OneToOne(() => InventoryEntity, (inventory) => inventory.variant, {
    nullable: true,
  })
  inventory?: InventoryEntity | null

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

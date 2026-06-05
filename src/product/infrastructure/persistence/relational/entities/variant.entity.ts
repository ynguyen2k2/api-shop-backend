import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductEntity } from 'src/product/infrastructure/persistence/relational/entities/product.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'
import { InventoryEntity } from 'src/product/infrastructure/persistence/relational/entities/inventory.entity'
import { VariantAttributeValueEntity } from './variant-attribute-value.entity'
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

  @OneToMany(() => VariantAttributeValueEntity, (value) => value.variant, {
    nullable: true,
  })
  values?: VariantAttributeValueEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

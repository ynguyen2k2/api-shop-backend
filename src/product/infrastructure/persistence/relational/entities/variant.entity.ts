import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductEntity } from 'src/product/infrastructure/persistence/relational/entities/product.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'
import { InventoryEntity } from 'src/product/infrastructure/persistence/relational/entities/inventory.entity'
import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
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

  @ManyToMany(
    () => AttributeValueEntity,
    (attributeValue) => attributeValue.variant,
    {
      cascade: true,
    },
  )
  value?: AttributeValueEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

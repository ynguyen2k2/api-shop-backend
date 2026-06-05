import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { ProductEntity } from 'src/product/infrastructure/persistence/relational/entities/product.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'product_attribute_value',
})
export class ProductAttributeValueEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => ProductEntity, (product) => product.attributeValues)
  product: ProductEntity

  @OneToOne(() => AttributeValueEntity, (attribute) => attribute.value)
  attribute: AttributeValueEntity

  @Column({ type: Boolean, default: true })
  isActive: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}

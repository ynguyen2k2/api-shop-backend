import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { VariantEntity } from './variant.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'variant_attribute_value',
})
export class VariantAttributeValueEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => VariantEntity, (variant) => variant.values)
  variant: VariantEntity

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

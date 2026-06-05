import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AttributeEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'
import { VariantEntity } from 'src/product/infrastructure/persistence/relational/entities/variant.entity'

@Entity({
  name: 'attribute-value',
})
export class AttributeValueEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  value: string

  @ManyToOne(() => AttributeEntity, (attribute) => attribute.attributeValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: AttributeEntity

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date

  @Column({ type: Boolean, default: true })
  isActive: boolean
}

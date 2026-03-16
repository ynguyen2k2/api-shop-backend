import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AttributeEntity } from '~/attributes/infrastructure/persistence/relational/entities/attribute.entity'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'

@Entity({
  name: 'attribute-value',
})
export class AttributeValueEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @Column('varchar', { length: 255 })
  value: string

  @ManyToOne(() => AttributeEntity, (attribute) => attribute.attributeValues)
  @JoinColumn({ name: 'attribute_id' })
  attribute: AttributeEntity

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: null })
  updatedAt: Date
}

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AttributeValueEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute-value.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'

@Entity({
  name: 'attribute',
})
export class AttributeEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  slug: string
  @Column({ type: String, nullable: true })
  type?: string

  @OneToMany(
    () => AttributeValueEntity,
    (attributeValue) => attributeValue.attribute,
    { cascade: true, onDelete: 'CASCADE' },
  )
  attributeValues: AttributeValueEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ type: Boolean, default: true })
  isActive: boolean
}

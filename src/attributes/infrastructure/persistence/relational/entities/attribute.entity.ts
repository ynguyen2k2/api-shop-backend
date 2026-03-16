import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AttributeValueEntity } from '~/attributes/infrastructure/persistence/relational/entities/attribute-value.entity'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'

@Entity({
  name: 'attribute',
})
export class AttributeEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @Column()
  name: string

  @Column()
  slug: string
  @Column({ type: String, nullable: true })
  type: string

  @OneToMany(
    () => AttributeValueEntity,
    (attributeValue) => attributeValue.attribute,
  )
  attributeValues: AttributeValueEntity[]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date
}

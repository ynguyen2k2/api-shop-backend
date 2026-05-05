import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { AttributeValueEntity } from '~/attribute-values/infrastructure/persistence/relational/entities/attribute-value.entity'
import { CategoryEntity } from '~/categories/infrastructure/persistence/relational/entities/category.entity'
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
    { cascade: true, onDelete: 'CASCADE' },
  )
  attributeValues: AttributeValueEntity[]

  @ManyToMany(() => CategoryEntity, (category) => category.attribute)
  category: CategoryEntity
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date
}

import { AttributeEntity } from 'src/attribute/infrastructure/persistence/relational/entities/attribute.entity'
import { CategoryEntity } from 'src/category/infrastructure/persistence/relational/entities/category.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'category_attribute',
})
export class CategoryAttributeEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => CategoryEntity, (category) => category.categoryAttributes)
  category: CategoryEntity

  @ManyToOne(() => AttributeEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  attribute: AttributeEntity

  @Column({
    default: false,
  })
  isVariant: boolean

  @Column({
    default: false,
  })
  isRequired: boolean

  @Column({
    default: false,
  })
  isFilterable: boolean

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({
    default: true,
  })
  isActive: boolean
}

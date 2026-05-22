import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'
import { EntityRelationalHelper } from 'utils/relational-entity-helper'
import { CategoryAttributeEntity } from 'category/infrastructure/persistence/relational/entities/category-attribute.entity'

@Entity({
  name: 'category',
})
export class CategoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ type: String })
  name: string

  @Column({ type: String, unique: true })
  slug: string

  @Column({ type: String, nullable: true })
  description: string | null

  @Column({ type: String, nullable: true })
  image: string | null

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: CategoryEntity | null

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[] | null

  @OneToMany(
    () => CategoryAttributeEntity,
    (categoryAttribute) => categoryAttribute.category,
  )
  categoryAttributes: CategoryAttributeEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
  @Column({ type: Boolean, default: true })
  isActive: boolean
}

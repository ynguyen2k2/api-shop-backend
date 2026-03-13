import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'

@Entity({
  name: 'product',
})
export class ProductEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  price: number

  @Column()
  stock: number

  @Column()
  imageUrl: string

  @Column()
  category: string

  @Column()
  brand: string

  @Column()
  isActive: boolean

  @Column()
  isFeatured: boolean

  @Column()
  isNew: boolean

  @Column()
  averageRating: number

  @Column()
  totalReviews: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

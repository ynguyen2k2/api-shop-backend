import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { ProductEntity } from 'src/product/infrastructure/persistence/relational/entities/product.entity'
import { UserEntity } from 'src/user/infrastructure/persistence/relational/entities/user.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'

@Entity({
  name: 'review',
})
@Unique(['user', 'product'])
export class ReviewEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @ManyToOne(() => UserEntity, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  user: UserEntity

  @ManyToOne(() => ProductEntity, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity

  @Column({ type: 'int' })
  rating: number

  @Column({ type: 'varchar', nullable: true })
  comment?: string | null

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

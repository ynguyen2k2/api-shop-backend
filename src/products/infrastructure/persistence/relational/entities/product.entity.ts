import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ImageProductEntity } from '~/image-products/infrastructure/persistence/relational/entities/image-product.entity'
import { ReviewEntity } from '~/reviews/infrastructure/persistence/relational/entities/review.entity'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'
import { VariantEntity } from '~/variants/infrastructure/persistence/relational/entities/variant.entity'

@Entity({
  name: 'product',
})
export class ProductEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @Column({ type: String })
  name: string

  @Column({ type: String, nullable: true })
  description: string | null

  @Column({ type: String, nullable: true })
  shortDescription: string | null

  @Column({ type: String, nullable: true })
  specifications: string | null

  @Column({ type: String })
  slug: string

  @OneToMany(() => ImageProductEntity, (imageProduct) => imageProduct.product)
  images: ImageProductEntity[]

  @Column({ type: String })
  brand: string

  @Column({ type: String })
  category: string

  @OneToMany(() => ReviewEntity, (review) => review.product)
  reviews: ReviewEntity[]

  @OneToMany(() => VariantEntity, (variant) => variant.product)
  variants: VariantEntity[]

  @Column({ type: Boolean, default: false })
  isFeatured: boolean

  @Column({ type: Boolean, default: true })
  isNew: boolean

  @Column({ type: Number, nullable: true })
  averageRating: number

  @Column({ type: Number, nullable: true })
  totalReviews: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
  @Column({ type: Boolean, default: true })
  isActive: boolean
}

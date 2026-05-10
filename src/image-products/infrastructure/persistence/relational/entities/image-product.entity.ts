import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { FileEntity } from '~/files/infrastructure/persistence/relational/entities/file.entity'
import { ProductEntity } from '~/products/infrastructure/persistence/relational/entities/product.entity'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'

@Entity({
  name: 'image_product',
})
export class ImageProductEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @OneToOne(() => FileEntity, { nullable: true, eager: true })
  photo?: FileEntity

  @ManyToOne(() => ProductEntity, { nullable: true, eager: true })
  product?: ProductEntity

  @Column({ type: 'int', default: 0 })
  order: number

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ type: 'boolean', default: false })
  isActive: boolean
}

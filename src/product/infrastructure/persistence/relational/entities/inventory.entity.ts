import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { EntityRelationalHelper } from '~/utils/relational-entity-helper'
import { VariantEntity } from '~/product/infrastructure/persistence/relational/entities/variant.entity'

@Entity({
  name: 'inventory',
})
export class InventoryEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string | number

  @OneToOne(() => VariantEntity, (variant) => variant.inventory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  variant: VariantEntity

  @Column()
  quantity: number

  @Column()
  reserved: number

  @Column()
  warehouse: string

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

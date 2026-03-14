import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
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

  @Column()
  type: string

  @Column()
  value: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

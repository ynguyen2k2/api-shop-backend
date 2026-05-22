import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm'
import { UserEntity } from 'src/user/infrastructure/persistence/relational/entities/user.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'

@Entity({
  name: 'session',
})
export class SessionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: string

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  user: UserEntity

  @Column()
  hash: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}

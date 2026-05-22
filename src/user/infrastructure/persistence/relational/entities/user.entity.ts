import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum'
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity'
import { ReviewEntity } from 'src/review/infrastructure/persistence/relational/entities/review.entity'
import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity'
import { StatusEntity } from 'src/statuses/infrastucture/persistence/relational/entities/status.entity'
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper'

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: string

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  email: string | null

  @Column({ nullable: true })
  password?: string

  @Column({ default: AuthProvidersEnum.EMAIL })
  provider?: string

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn()
  photo?: FileEntity | null

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity | null

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: true })
  isActive: boolean
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleSeedService } from 'src/database/seeds/relational/role/role-seed.service'
import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}

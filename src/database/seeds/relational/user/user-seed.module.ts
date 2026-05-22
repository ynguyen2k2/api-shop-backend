import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserSeedService } from 'src/database/seeds/relational/user/user-seed.service'
import { UserEntity } from 'src/user/infrastructure/persistence/relational/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StatusSeedService } from 'database/seeds/relational/status/status-seed.service'
import { StatusEntity } from 'statuses/infrastucture/persistence/relational/entities/status.entity'

@Module({
  imports: [TypeOrmModule.forFeature([StatusEntity])],
  providers: [StatusSeedService],
  exports: [StatusSeedService],
})
export class StatusSeedModule {}

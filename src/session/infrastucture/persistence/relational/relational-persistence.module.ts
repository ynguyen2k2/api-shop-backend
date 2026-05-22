import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionEntity } from './entities/session.entity'
import { SessionRepository } from 'src/session/infrastucture/persistence/session.respository'
import { SessionRelationalRepository } from 'src/session/infrastucture/persistence/relational/respositories/session.respository'

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionRelationalRepository,
    },
  ],
  exports: [SessionRepository],
})
export class RelationalSessionPersistenceModule {}

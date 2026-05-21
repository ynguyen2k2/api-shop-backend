import { Module } from '@nestjs/common'
import { RelationalSessionPersistenceModule } from 'session/infrastucture/persistence/relational/relational-persistence.module'
import { SessionService } from 'session/session.service'

const infrastructurePersistenceModule = RelationalSessionPersistenceModule
@Module({
  imports: [infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}

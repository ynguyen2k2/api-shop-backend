import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UserService } from './users.service'
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { FilesModule } from 'src/files/file.module'
// import { MyLogger } from 'src/logger/mylogger.service'
import { MyLoggerModule } from 'src/logger/mylogger.module'

// <database-block>
const infrastructurePersistenceModule = RelationalUserPersistenceModule
// </database-block>

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
    MyLoggerModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService, infrastructurePersistenceModule],
})
export class UsersModule {}

import {
  // common
  Module,
} from '@nestjs/common'
import { FilesService } from 'src/files/file.service'
import { RelationalFilePersistenceModule } from 'src/files/infrastructure/persistence/relational/relational-persistence.module'
import { FilesLocalModule } from 'src/files/infrastructure/upload/local/files.module'

// // <database-block>
// const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
//   .isDocumentDatabase
//   ? DocumentFilePersistenceModule
//   : RelationalFilePersistenceModule
// // </database-block>

// const infrastructureUploaderModule =
//   (fileConfig() as FileConfig).driver === FileDriver.LOCAL
//     ? FilesLocalModule
//     : (fileConfig() as FileConfig).driver === FileDriver.S3
//       ? FilesS3Module
//       : FilesS3PresignedModule

// <database-block>
const infrastructurePersistenceModule = RelationalFilePersistenceModule
// </database-block>

// const infrastructureUploaderModule =
//   (fileConfig() as FileConfig).driver === FileDriver.LOCAL
//     ? FilesLocalModule
//     : (fileConfig() as FileConfig).driver === FileDriver.S3
//       ? FilesS3Module
//       : FilesS3PresignedModule

const infrastructureUploaderModule = FilesLocalModule

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    infrastructureUploaderModule,
  ],
  providers: [FilesService],
  exports: [FilesService, infrastructurePersistenceModule],
})
export class FilesModule {}

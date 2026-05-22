import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common'
import { FilesLocalController } from './files.controller'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { diskStorage } from 'multer'
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util'
import { RelationalFilePersistenceModule } from 'src/files/infrastructure/persistence/relational/relational-persistence.module'
import { AllConfigType } from 'src/config/config.type'
import { FilesLocalService } from 'src/files/infrastructure/upload/local/file.services'

// <database-block>
// const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
//   .isDocumentDatabase
//   ? DocumentFilePersistenceModule
//   : RelationalFilePersistenceModule
// </database-block>
const infrastructurePersistenceModule = RelationalFilePersistenceModule
@Module({
  imports: [
    infrastructurePersistenceModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new UnprocessableEntityException({
                  status: HttpStatus.UNPROCESSABLE_ENTITY,
                  errors: {
                    file: `cantUploadFileType`,
                  },
                }),
                false,
              )
            }

            callback(null, true)
          },
          storage: diskStorage({
            destination: './files',
            filename: (request, file, callback) => {
              callback(
                null,
                `${randomStringGenerator()}.${file.originalname
                  .split('.')
                  .pop()
                  ?.toLowerCase()}`,
              )
            },
          }),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        }
      },
    }),
  ],
  controllers: [FilesLocalController],
  providers: [ConfigModule, ConfigService, FilesLocalService],
  exports: [FilesLocalService],
})
export class FilesLocalModule {}

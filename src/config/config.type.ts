import { AppConfig } from './app-config.type'
import { DatabaseConfig } from '../database/config/database-config.type'
import { FileConfig } from 'src/files/config/file-config.type'
import { AuthConfig } from 'src/auth/config/auth-config.type'
import { MailConfig } from 'src/mail/config/mail-config.type'
export type AllConfigType = {
  app: AppConfig
  database: DatabaseConfig
  file: FileConfig
  auth: AuthConfig
  mail: MailConfig
}

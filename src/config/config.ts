import authConfig from 'src/auth/config/auth.config'
import appConfig from 'src/config/app-config'
import databaseConfig from 'src/database/config/database-config'
import fileConfig from 'src/files/config/file-config'
import mailConfig from 'src/mail/config/mail.config'

export const AllConfig = [
  appConfig,
  databaseConfig,
  fileConfig,
  authConfig,
  mailConfig,
]

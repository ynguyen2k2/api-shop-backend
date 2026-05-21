import authConfig from 'auth/config/auth.config'
import appConfig from 'config/app-config'
import databaseConfig from 'database/config/database-config'
import fileConfig from 'files/config/file-config'
import mailConfig from 'mail/config/mail.config'

export const AllConfig = [
  appConfig,
  databaseConfig,
  fileConfig,
  authConfig,
  mailConfig,
]

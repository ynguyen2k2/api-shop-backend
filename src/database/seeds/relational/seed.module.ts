import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DataSource, DataSourceOptions } from 'typeorm'

import { RoleSeedModule } from './role/role-seed.module'
import { StatusSeedModule } from './status/status-seed.module'
import { UserSeedModule } from './user/user-seed.module'
import appConfig from 'src/config/app-config'
import databaseConfig from 'src/database/config/database-config'
import { TypeOrmConfigService } from 'src/database/typeorm-config.services'
import { CategorySeedModule } from 'src/database/seeds/relational/category/category-seed.module'
import { AttributeSeedModule } from 'src/database/seeds/relational/attribute/attribute-seed.module'

@Module({
  imports: [
    AttributeSeedModule,
    CategorySeedModule,
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options?: DataSourceOptions) => {
        return new DataSource(options!).initialize()
      },
    }),
  ],
})
export class SeedModule {}

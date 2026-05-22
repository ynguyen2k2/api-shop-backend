import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmConfigService } from './database/typeorm-config.services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions } from 'typeorm'
import { UsersModule } from 'user/users.module'
import { AuthModule } from 'auth/auth.module'
import { AllConfig } from 'config/config'
import { HeaderResolver, I18nModule } from 'nestjs-i18n'
import { AllConfigType } from 'config/config.type'
import path from 'path'
import { CartModule } from './cart/cart.module'
import { ReviewModule } from './review/review.module'

// <database-block>
const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options?: DataSourceOptions) => {
    if (!options) {
      throw new Error('DataSource options are required')
    }
    return new DataSource(options).initialize()
  },
})
// </database-block>
import { ProductModule } from './product/product.module'

import { AttributeModule } from './attribute/attribute.module'
import { CategoryModule } from 'category/category.module'

@Module({
  imports: [
    ReviewModule,
    // CartModule,
    AttributeModule,
    CategoryModule,
    // ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: AllConfig,
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ]
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

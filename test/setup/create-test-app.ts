import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '../../src/app.module'
import { resetDatabase } from './reset-database'

let app: INestApplication
export async function createTestApp() {
  if (app) return app
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleFixture.createNestApplication()

  app.enableVersioning({
    type: VersioningType.URI,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  await app.init()
  await resetDatabase(app)
  return app
}

export async function closeTestApp() {
  if (app) await app.close()
}

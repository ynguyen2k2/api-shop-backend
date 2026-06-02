import { DataSource } from 'typeorm'
import { INestApplication } from '@nestjs/common'

export async function resetDatabase(app: INestApplication) {
  const dataSource = app.get(DataSource)
  await dataSource.dropDatabase()
  await dataSource.synchronize()
}

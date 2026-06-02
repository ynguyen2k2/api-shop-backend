import { INestApplication } from '@nestjs/common'
import request from 'supertest'

import { fakeCategory } from '../helpers/faker.helper'

export async function createCategory(app: INestApplication, overrides = {}) {
  const payload = {
    ...fakeCategory(),
    ...overrides,
  }

  const response = await request(app.getHttpServer())
    .post('/v1/categories')
    .send(payload)
    .expect(201)

  return response.body
}

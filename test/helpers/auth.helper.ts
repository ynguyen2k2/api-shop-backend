import { INestApplication } from '@nestjs/common'
import request from 'supertest'

export async function loginAsAdmin(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/v1/auth/email/login')
    .send({
      email: 'admin@example.com',
      password: '123456',
    })
    .expect(200)

  return response.body.token
}

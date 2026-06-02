import request from 'supertest'

export function authRequest(app, token: string) {
  return request(app.getHttpServer()).set('Authorization', `Bearer ${token}`)
}

//Usage
// await authRequest(app, token)
//   .post('/v1/categories')
//   .send({
//     name: 'T-Shirt',
//   })

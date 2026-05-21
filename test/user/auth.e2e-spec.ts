import request from 'supertest'
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'app.module'
import {
  MAIL_HOST,
  MAIL_PORT,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants'
import { myLogger } from 'logger/mylogger.service'
import { ResolvePromisesInterceptor } from 'utils/serializer-interceptor'
import { Reflector } from '@nestjs/core'

describe('User Controller E2E Tests', () => {
  let app: INestApplication
  const newUserFirstName = `Tester${Date.now()}`
  const newUserLastName = `E2E`
  const newUserEmail = `User.${Date.now()}@example.com`
  const newUserPassword = `secret`
  const mail = `http://${MAIL_HOST}:${MAIL_PORT}`
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('api/v1')
    app.useGlobalInterceptors(
      new ResolvePromisesInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector)),
    )
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init()
  })
  afterAll(async () => {
    await app.close()
  })
  describe('Register Email', () => {
    it('should register a new user: /api/v1/auth/email/register (POST)', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/email/register')
        .send({
          username: TESTER_EMAIL,
          email: TESTER_PASSWORD,
          firstName: 'Tester',
          lastName: 'E2E',
        })
        .expect(201)
    })
    it('should fail with exists email: /api/v1/auth/email/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
          firstName: 'Tester',
          lastName: 'E2E',
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY)
        .expect(({ body }) => {
          expect(body.errors.email).toBeDefined()
        })
    })

    it('should successfully: /api/v1/auth/email/register (POST)', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
          firstName: newUserFirstName,
          lastName: newUserLastName,
        })
        .expect(204)
    })
  })
  describe('Confirm email', () => {
    it('should successfully: /api/v1/auth/email/confirm (POST)', async () => {
      const hash = await request(mail)
        .get('/email')
        .then(({ body }) =>
          body
            .find(
              (letter) =>
                letter.to[0].address.toLowerCase() ===
                  newUserEmail.toLowerCase() &&
                /.*confirm\?hash=(\S+).*/g.test(letter.text),
            )
            ?.text.replace(/.*confirm\?hash=(\S+).*/g, '$1'),
        )

      return request(app.getHttpServer())
        .get(`/api/v1/auth/email/confirm?hash=${hash}`)
        .expect(204)
    })
    it('should fail for already confirmed email: /api/v1/auth/email/confirm (POST)', async () => {
      const hash = await request(mail)
        .get('/email')
        .then(({ body }) =>
          body
            .find(
              (letter) =>
                letter.to[0].address.toLowerCase() ===
                  newUserEmail.toLowerCase() &&
                /.*confirm\?hash=(\S+).*/g.test(letter.text),
            )
            ?.text.replace(/.*confirm\?hash=(\S+).*/g, '$1'),
        )

      return request(app.getHttpServer())
        .get('/api/v1/auth/email/confirm?hash=' + hash)
        .expect(404)
    })
  })

  describe('Login Email', () => {
    it('should successfully with unconfirmed email: /api/v1/auth/email/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined()
        })
    })
  })

  describe('Login', () => {
    it('should successfully for user with confirmed email: /api/v1/auth/email/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.token).toBeDefined()
          expect(body.refreshToken).toBeDefined()
          expect(body.tokenExpires).toBeDefined()
          expect(body.user.email).toBeDefined()
          expect(body.user.hash).toBeUndefined()
          expect(body.user.password).toBeUndefined()
        })
    })
  })
  describe('Logged in user', () => {
    let newUserApiToken

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => {
          newUserApiToken = body.token
        })
    })

    it('should retrieve your own profile: /api/v1/auth/me (GET)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .auth(newUserApiToken, {
          type: 'bearer',
        })
        .send()
        .expect(({ body }) => {
          expect(body.provider).toBeDefined()
          expect(body.email).toBeDefined()
          expect(body.hash).not.toBeDefined()
          expect(body.password).not.toBeDefined()
        })
    })

    it('should get new refresh token: /api/v1/auth/refresh (POST)', async () => {
      let newUserRefreshToken = await request(app.getHttpServer())
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.refreshToken)

      newUserRefreshToken = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .send()
        .then(({ body }) => body.refreshToken)

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .send()
        .expect(({ body }) => {
          expect(body.token).toBeDefined()
          expect(body.refreshToken).toBeDefined()
          expect(body.tokenExpires).toBeDefined()
        })
    })

    it('should fail on the second attempt to refresh token with the same token: /api/v1/auth/refresh (POST)', async () => {
      const newUserRefreshToken = await request(app.getHttpServer())
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => body.refreshToken)

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .send()

      await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .auth(newUserRefreshToken, {
          type: 'bearer',
        })
        .send()
        .expect(401)
    })
    describe('Update user profile', () => {
      it('should update profile successfully: /api/v1/auth/me (PATCH)', async () => {
        const newUserNewName = Date.now()
        const newUserNewPassword = 'new-secret'
        const newUserApiToken = await request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserPassword })
          .then(({ body }) => body.token)
        // Try to update without old password
        await request(app.getHttpServer())
          .patch('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })
          .send({
            firstName: newUserNewName,
            password: newUserNewPassword,
          })
          .expect(422)

        await request(app.getHttpServer())
          .patch('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })
          .send({
            firstName: newUserNewName,
            password: newUserNewPassword,
            oldPassword: newUserPassword,
          })
          .expect(200)
        // Test updated back to original password
        await request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserNewPassword })
          .expect(200)
          .expect(({ body }) => {
            expect(body.token).toBeDefined()
          })

        await request(app.getHttpServer())
          .patch('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })
          .send({ password: newUserPassword, oldPassword: newUserNewPassword })
          .expect(200)
      })

      it('should update profile email successfully: /api/v1/auth/me (PATCH)', async () => {
        const newUserFirstNameUpdate = `Tester${Date.now()}`
        const newUserLastNameUpdate = `E2E`
        const newUserEmailUpdate = `user.${Date.now()}@example.com`
        const newUserPasswordUpdate = `secret`
        const newUserNewEmailUpdate = `new.${newUserEmailUpdate}`
        //Register new user
        await request(app.getHttpServer())
          .post('/api/v1/auth/email/register')
          .send({
            email: newUserEmailUpdate,
            password: newUserPasswordUpdate,
            firstName: newUserFirstNameUpdate,
            lastName: newUserLastNameUpdate,
          })
          .expect(204)
        //Test Get New User Api Token
        const newUserApiToken = await request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmailUpdate, password: newUserPasswordUpdate })
          .then(({ body }) => {
            return body.token
          })
        // Update Email Request
        await request(app.getHttpServer())
          .patch('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })
          .send({
            email: newUserNewEmailUpdate,
          })
          .expect(200)
        // Get confirmation hash from email
        const hash = await request(mail)
          .get('/email')
          .then(({ body }) =>
            body
              .find((letter) => {
                return (
                  letter.to[0].address.toLowerCase() ===
                    newUserNewEmailUpdate.toLowerCase() &&
                  /.*confirm\/new\?hash=(\S+).*/g.test(letter.text)
                )
              })
              ?.text.replace(/.*confirm\/new\?hash=(\S+).*/g, '$1'),
          )
        // Verify email has not been updated yet
        await request(app.getHttpServer())
          .get('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })
          .expect(200)
          .expect(({ body }) => {
            expect(body.email).not.toBe(newUserNewEmailUpdate)
          })
        // Test login with old email fails
        await request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({
            email: newUserNewEmailUpdate,
            password: newUserPasswordUpdate,
          })
          .expect(422)

        await request(app.getHttpServer())
          .get('/api/v1/auth/email/confirm/new?hash=' + hash)
          .expect(204)

        await request(app.getHttpServer())
          .get('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })
          .expect(200)
          .expect(({ body }) => {
            expect(body.email).toBe(newUserNewEmailUpdate)
          })

        await request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({
            email: newUserNewEmailUpdate,
            password: newUserPasswordUpdate,
          })
          .expect(200)
      })

      it('should delete profile successfully: /api/v1/auth/me (DELETE)', async () => {
        const newUserApiToken = await request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserPassword })
          .then(({ body }) => body.token)

        await request(app.getHttpServer())
          .delete('/api/v1/auth/me')
          .auth(newUserApiToken, {
            type: 'bearer',
          })

        return request(app.getHttpServer())
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserPassword })
          .expect(422)
      })
    })
  })
})

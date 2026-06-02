import request from 'supertest'
import { INestApplication, HttpStatus } from '@nestjs/common'
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { createTestApp, closeTestApp } from '../../setup/create-test-app'

describe('Attribute CRUD E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })
  afterAll(async () => {
    await closeTestApp()
  })

  describe('Create Attribute', () => {
    it('should create attribute successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: 'Color',
        })
      // .expect(HttpStatus.CREATED)

      expect(response.body).toMatchObject({
        name: 'Color',
      })
    })

    it('should fail when name is empty', async () => {
      await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: '',
        })
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should fail when name already exists', async () => {
      await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: 'Rom',
        })
        .expect(HttpStatus.CREATED)

      await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: 'Rom',
        })
        .expect(HttpStatus.BAD_REQUEST)
    })

    describe('Get Attributes', () => {
      it('should return attribute list', async () => {
        const response = await request(app.getHttpServer())
          .get('/v1/attributes')
          .expect(HttpStatus.OK)

        expect(Array.isArray(response.body.data)).toBe(true)
      })

      it('should return attribute detail', async () => {
        const created = await request(app.getHttpServer())
          .post('/v1/attributes')
          .send({
            name: 'Monitor',
          })

        const attributeId = created.body.id
        const response = await request(app.getHttpServer())
          .get(`/v1/attributes/${attributeId}`)
          .expect(HttpStatus.OK)

        expect(response.body).toMatchObject({
          id: attributeId,
          name: 'Monitor',
        })
      })

      it('should return 404 when attribute not found', async () => {
        await request(app.getHttpServer())
          .get('/v1/attributes/999999')
          .expect(HttpStatus.NOT_FOUND)
      })
    })
  })

  describe('Update Attribute', () => {
    it('should update attribute successfully', async () => {
      const created = await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: 'Ram',
        })

      const attributeId = created.body.id

      console.log('🚀 ~ attribute.e2e-spec.ts:110 ~ attributeId:', created.body)

      const response = await request(app.getHttpServer())
        .patch(`/v1/attributes/${attributeId}`)
        .send({
          name: 'Updated Ram',
        })
        .expect(200)

      console.log('🚀 ~ attribute.e2e-spec.ts:112 ~ response:', response.body)

      expect(response.body).toMatchObject({
        id: attributeId,
        name: 'Updated Ram',
      })
    })

    it('should return 404 when updating missing attribute', async () => {
      await request(app.getHttpServer())
        .patch('/v1/attributes/999999')
        .send({
          name: 'Updated',
        })
        .expect(404)
    })
  })

  describe('Delete Attribute', () => {
    it('should delete attribute successfully', async () => {
      const created = await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: 'Storage',
        })

      const attributeId = created.body.id

      console.log(
        '🚀 ~ attribute.e2e-spec.ts:139 ~ created.body:',
        created.body,
      )

      await request(app.getHttpServer())
        .delete(`/v1/attributes/${attributeId}`)
        .expect(200)
    })
    it('should return 404 when deleting missing attribute', async () => {
      await request(app.getHttpServer())
        .delete('/v1/attributes/999999')
        .expect(404)
    })
  })
})

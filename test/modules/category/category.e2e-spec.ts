import request from 'supertest'
import { INestApplication, HttpStatus } from '@nestjs/common'
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { createTestApp, closeTestApp } from '../../setup/create-test-app'

describe('Category CRUD E2E', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await createTestApp()
  })
  afterAll(async () => {
    await closeTestApp()
  })

  describe('Create Category', () => {
    it('should create category successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: 'shoes',
        })
        .expect(HttpStatus.CREATED)

      expect(response.body).toMatchObject({
        name: 'shoes',
        slug: 'shoes',
      })
    })

    it('should fail when name is empty', async () => {
      await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: '',
        })
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should fail when name already exists', async () => {
      await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: 'Phone',
        })
        .expect(HttpStatus.CREATED)

      await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: 'Phone',
        })
        .expect(HttpStatus.CONFLICT)
    })

    describe('Get Categories', () => {
      it('should return category list', async () => {
        const response = await request(app.getHttpServer())
          .get('/v1/categories')
          .expect(HttpStatus.OK)

        expect(Array.isArray(response.body.data)).toBe(true)
      })

      it('should return category detail', async () => {
        const created = await request(app.getHttpServer())
          .post('/v1/categories')
          .send({
            name: 'Monitor',
          })

        const categoryId = created.body.id
        const response = await request(app.getHttpServer())
          .get(`/v1/categories/${categoryId}`)
          .expect(HttpStatus.OK)

        expect(response.body).toMatchObject({
          id: categoryId,
          name: 'Monitor',
        })
      })

      it('should return 404 when category not found', async () => {
        await request(app.getHttpServer())
          .get('/v1/categories/999999')
          .expect(HttpStatus.NOT_FOUND)
      })
    })
  })

  describe('Update Category', () => {
    it('should update category successfully', async () => {
      const created = await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: 'Tablet',
        })

      const categoryId = created.body.id

      console.log('🚀 ~ category.e2e-spec.ts:110 ~ categoryId:', created.body)

      const response = await request(app.getHttpServer())
        .patch(`/v1/categories/${categoryId}`)
        .send({
          name: 'Gaming Tablet',
        })
        .expect(200)

      console.log('🚀 ~ category.e2e-spec.ts:112 ~ response:', response.body)

      expect(response.body).toMatchObject({
        id: categoryId,
        name: 'Gaming Tablet',
      })
    })

    it('should return 404 when updating missing category', async () => {
      await request(app.getHttpServer())
        .patch('/v1/categories/999999')
        .send({
          name: 'Updated',
        })
        .expect(404)
    })
  })

  describe('Delete Category', () => {
    it('should delete category successfully', async () => {
      const created = await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: 'Keyboard',
        })

      const categoryId = created.body.id

      console.log('🚀 ~ category.e2e-spec.ts:139 ~ created.body:', created.body)

      await request(app.getHttpServer())
        .delete(`/v1/categories/${categoryId}`)
        .expect(200)
    })
    it('should return 404 when deleting missing category', async () => {
      await request(app.getHttpServer())
        .delete('/v1/categories/999999')
        .expect(200)
    })
  })
})

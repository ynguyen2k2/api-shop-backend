import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import { AppModule } from 'app.module'

describe('Category Attribute Flow (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Create category -> attribute -> attribute values -> attach category attribute', () => {
    let categoryId: string
    let attributeId: string
    let categoryAttributeId: string

    it('should create category', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/categories')
        .send({
          name: 'T-Shirt',
          slug: 't-shirt',
          description: 'T-Shirt category',
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')

      expect(response.body.name).toBe('T-Shirt')

      categoryId = response.body.id
    })

    it('should create attribute', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/attributes')
        .send({
          name: 'Size',
          slug: 'size',
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')

      expect(response.body.name).toBe('Size')

      attributeId = response.body.id
    })

    it('should create attribute value S', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/attributes/${attributeId}/values`)
        .send({
          value: 'S',
        })
        .expect(201)

      expect(response.body.value).toBe('S')
    })

    it('should create attribute value M', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/attributes/${attributeId}/values`)
        .send({
          value: 'M',
        })
        .expect(201)

      expect(response.body.value).toBe('M')
    })

    it('should attach attribute into category', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/categories/${categoryId}/attributes`)
        .send({
          attributeId,
          isVariant: true,
          isRequired: true,
          isFilterable: true,
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')

      expect(response.body.isVariant).toBe(true)

      expect(response.body.attribute.id).toBe(attributeId)

      expect(response.body.category.id).toBe(categoryId)

      categoryAttributeId = response.body.id
    })

    it('should find category attribute by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/category-attributes/${categoryAttributeId}`)
        .expect(200)

      expect(response.body.id).toBe(categoryAttributeId)

      expect(response.body.attribute.id).toBe(attributeId)
    })

    it('should update category attribute', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/v1/category-attributes/${categoryAttributeId}`)
        .send({
          isFilterable: false,
        })
        .expect(200)

      expect(response.body.isFilterable).toBe(false)
    })

    it('should delete category attribute', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/category-attributes/${categoryAttributeId}`)
        .expect(204)
    })
  })
})

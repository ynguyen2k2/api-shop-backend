import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { closeTestApp, createTestApp } from '../../setup/create-test-app'

describe('Create category -> attribute -> attribute values -> attach category attribute', () => {
  let categoryId: string
  let attributeId: string
  let categoryAttributeId: string
  let app: INestApplication
  beforeAll(async () => {
    app = await createTestApp()
  })
  afterAll(async () => {
    await closeTestApp()
  })
  it('should create category', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/categories')
      .send({
        name: 'T-Shirt',
        description: 'T-Shirt category',
      })
      .expect(201)
    expect(response.body).toHaveProperty('id')

    expect(response.body.name).toBe('T-Shirt')

    categoryId = response.body.id.toString()
  })

  it('should create attribute', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/attributes')
      .send({
        name: 'Size',
      })
      .expect(201)

    expect(response.body).toHaveProperty('id')

    expect(response.body.name).toBe('Size')

    attributeId = response.body.id.toString()
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
      .post(`/v1/categories/${categoryId}/attributes/`)
      .send({
        attributeId,
        isVariant: true,
        isRequired: true,
        isFilterable: true,
      })
    expect(response.status).toBe(201)

    expect(response.body).toHaveProperty('id')

    console.log(
      '🚀 ~ add-attributeto-category.e2e-spec.ts:82 ~ response.body:',
      response.body,
    )

    expect(response.body.isVariant).toBe(true)

    expect(response.body.attribute.id).toBe(attributeId)

    expect(response.body.category.id).toBe(categoryId)

    categoryAttributeId = response.body.id
  })

  it('should find category attribute by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/v1/categories/${categoryId}/attributes/${categoryAttributeId}`)
      .expect(200)

    expect(response.body.id).toBe(categoryAttributeId)

    expect(response.body.attribute.id).toBe(attributeId)
  })

  it('should update category attribute', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/v1/categories/${categoryId}/attributes/${categoryAttributeId}`)
      .send({
        isFilterable: false,
      })
      .expect(200)

    expect(response.body.isFilterable).toBe(false)
  })

  it('should delete category attribute', async () => {
    await request(app.getHttpServer())
      .delete(`/v1/categories/${categoryId}/attributes/${categoryAttributeId}`)
      .expect(204)
  })
})

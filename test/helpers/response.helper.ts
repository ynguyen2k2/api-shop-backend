import { expect } from '@jest/globals'

export function expectPagination(body: any) {
  expect(body).toHaveProperty('data')
  expect(body).toHaveProperty('hasNextPage')
  expect(body).toHaveProperty('page')
}

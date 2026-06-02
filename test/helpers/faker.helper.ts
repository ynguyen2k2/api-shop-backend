import { faker } from '@faker-js/faker'

type FakeCategoryInput = Partial<{
  name: string
  slug: string
  description: string
}>

export function fakeCategory(overrides?: FakeCategoryInput) {
  const name = faker.commerce.department()

  return {
    name,

    slug: `${faker.helpers.slugify(name)}-${faker.string.uuid()}`,

    description: faker.commerce.productDescription(),

    ...overrides,
  }
}

import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductRepository } from './infrastructure/persistence/product.repository'
import { IPaginationOptions } from '../utils/type/pagination-options'
import { Product } from './domain/product'
import slugify from '~/utils/slugify'

@Injectable()
export class ProductsService {
  constructor(
    // Dependencies here
    private readonly productRepository: ProductRepository,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const slugProduct = slugify(createProductDto.name)

    return this.productRepository.create({
      ...createProductDto,
      slug: slugProduct,
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.productRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: Product['id']) {
    return this.productRepository.findById(id)
  }

  findByIds(ids: Product['id'][]) {
    return this.productRepository.findByIds(ids)
  }

  async update(
    id: Product['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProductDto: UpdateProductDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.productRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: Product['id']) {
    return this.productRepository.remove(id)
  }
}

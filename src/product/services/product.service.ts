import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateProductDto } from '../dto/product/create-product.dto'
import { UpdateProductDto } from '../dto/product/update-product.dto'
import { ProductRepository } from '../domain/respositories/product.repository'
import { IPaginationOptions } from '../../utils/type/pagination-options'
import { Product } from '../domain/product'
import slugify from 'src/utils/slugify'
import { Category } from 'src/category/domain/category'
import { CategoryService } from 'src/category/service/category.service'

@Injectable()
export class ProductService {
  constructor(
    // Dependencies here
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const slugProduct = slugify(createProductDto.name)

    let category: Category | null = null
    if (createProductDto.categoryId) {
      category = await this.categoryService.findById(
        createProductDto.categoryId,
      )
    }

    return this.productRepository.create({
      ...createProductDto,
      slug: slugProduct,
      category,
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

    updateProductDto: UpdateProductDto,
  ) {
    let category: Category | null = null
    if (updateProductDto.categoryId) {
      category = await this.categoryService.findById(
        updateProductDto.categoryId,
      )
    }
    return this.productRepository.update(id, {
      ...updateProductDto,
      category,
    })
  }

  remove(id: Product['id']) {
    return this.productRepository.remove(id)
  }
}

import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateproductImageDto } from './dto/create-product-image.dto'
import { UpdateproductImageDto } from './dto/update-product-image.dto'
import { productImageRepository } from './infrastructure/persistence/product-image.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { productImage } from './domain/product-image'

@Injectable()
export class productImagesService {
  constructor(
    // Dependencies here
    private readonly productImageRepository: productImageRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createproductImageDto: CreateproductImageDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.productImageRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.productImageRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: productImage['id']) {
    return this.productImageRepository.findById(id)
  }

  findByIds(ids: productImage['id'][]) {
    return this.productImageRepository.findByIds(ids)
  }

  async update(
    id: productImage['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateproductImageDto: UpdateproductImageDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.productImageRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: productImage['id']) {
    return this.productImageRepository.remove(id)
  }
}

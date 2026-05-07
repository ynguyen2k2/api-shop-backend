import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateimageProductDto } from './dto/create-image-product.dto'
import { UpdateimageProductDto } from './dto/update-image-product.dto'
import { imageProductRepository } from './infrastructure/persistence/image-product.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { imageProduct } from './domain/image-product'

@Injectable()
export class ImageProductService {
  constructor(
    // Dependencies here
    private readonly imageProductRepository: imageProductRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createimageProductDto: CreateimageProductDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.imageProductRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.imageProductRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: imageProduct['id']) {
    return this.imageProductRepository.findById(id)
  }

  findByIds(ids: imageProduct['id'][]) {
    return this.imageProductRepository.findByIds(ids)
  }

  async update(
    id: imageProduct['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateimageProductDto: UpdateimageProductDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.imageProductRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: imageProduct['id']) {
    return this.imageProductRepository.remove(id)
  }
}

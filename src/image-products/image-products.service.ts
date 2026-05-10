import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateImageProductDto } from './dto/create-image-product.dto'
import { UpdateImageProductDto } from './dto/update-image-product.dto'
import { ImageProductRepository } from './infrastructure/persistence/image-product.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { ImageProduct } from './domain/image-product'
import { FileType } from '~/files/domain/file'
import { Product } from '~/products/domain/product'
import { ProductsService } from '~/products/products.service'
import { FilesService } from '~/files/file.service'

@Injectable()
export class ImageProductService {
  constructor(
    // Dependencies here
    private readonly imageProductRepository: ImageProductRepository,
    private readonly filesService: FilesService,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createImageProductDto: CreateImageProductDto,
  ) {
    const photoId = createImageProductDto.photo?.id
    let photo: FileType | null = null
    let product: Product | null = null
    if (photoId) {
      photo = await this.filesService.findById(photoId.toString())
    }
    const productId = createImageProductDto.product?.id
    if (productId) {
      product = await this.productsService.findById(productId)
    }
    return this.imageProductRepository.create({
      photo,
      product,
      order: createImageProductDto.order,
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

  findById(id: ImageProduct['id']) {
    return this.imageProductRepository.findById(id)
  }

  findByIds(ids: ImageProduct['id'][]) {
    return this.imageProductRepository.findByIds(ids)
  }

  async update(
    id: ImageProduct['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateImageProductDto: UpdateImageProductDto,
  ) {
    const photoId = updateImageProductDto?.photo?.id
    const productId = updateImageProductDto.product?.id
    let photo: FileType | null = null
    let product: Product | null = null
    if (photoId) {
      photo = await this.filesService.findById(photoId.toString())
    }
    if (productId) {
      product = await this.productsService.findById(productId)
    }
    return this.imageProductRepository.update(id, {
      order: updateImageProductDto.order,
      photo,
      product,
    })
  }

  remove(id: ImageProduct['id']) {
    return this.imageProductRepository.remove(id)
  }
}

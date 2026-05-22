import { HttpStatus, UnprocessableEntityException } from '@nestjs/common'
import { FileDto } from 'src/files/dto/file-dto'
import { Product } from 'src/product/domain/product'
import { ProductImage } from 'src/product/domain/product-image'
import { ProductRepository } from 'src/product/domain/respositories/product.repository'
import { FilesService } from 'src/files/file.service'

export class ProductImageService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly fileService: FilesService,
  ) {}

  async attachImage(productId: Product['id'], file: FileDto) {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          product: 'productNotExists',
        },
      })
    }
    const photo = await this.fileService.findById(file.id)
    if (!photo) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          photo: 'photoNotExists',
        },
      })
    }
    const image = new ProductImage()
    image.photo = photo
    image.order = product.images?.length ?? 0
    product.images?.push(image)
    await this.productRepository.update(productId, { images: product.images })
  }
  async removeImage(productId: Product['id'], imageId: ProductImage['id']) {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          product: 'productNotExists',
        },
      })
    }
    const image = product.images?.find((image) => image.id === imageId)
    if (!image) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          image: 'imageNotExists',
        },
      })
    }
    product.images?.splice(product.images?.indexOf(image), 1)
    await this.productRepository.update(productId, { images: product.images })
    return {}
  }
  async reorderImages(
    productId: Product['id'],
    imagesIds: ProductImage['id'][],
  ) {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          product: 'productNotExists',
        },
      })
    }

    if (!product.images) {
      return
    }
    const reorderImages = imagesIds.map((imageId, index) => {
      const image = product.images?.find((image) => image.id === imageId)
      if (!image) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            image: 'imageNotExists',
          },
        })
      }
      image.order = index
      return image
    })
    product.images = reorderImages
    await this.productRepository.update(productId, { images: reorderImages })
  }
}

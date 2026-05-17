import { BadRequestException, Injectable } from '@nestjs/common'
import { ProductRepository } from '~/product/domain/respositories/product.repository'
import { VariantRepository } from '~/product/domain/respositories/variant.repository'
import { NotFoundException } from '@nestjs/common'
import { CreateVariantDto } from '~/product/dto/variant/create-variant.dto'
import { Variant } from '~/product/domain/variant'
import { Product } from '~/product/domain/product'
import { UpdateVariantDto } from '~/product/dto/variant/update-variant.dto'
import { generateUniqueSKU } from '~/utils/slugify'
import { IPaginationOptions } from '../../utils/type/pagination-options'

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: VariantRepository,
  ) {}
  //   createVariant()
  //  ├── find product
  //  ├── validate sku uniqueness
  //  ├── create variant
  //  └── save
  async createVariant(
    productId: Product['id'],
    createVariantDto: CreateVariantDto,
  ) {
    if (!productId) {
      throw new BadRequestException('Product ID is required')
    }
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new NotFoundException(`Product don't have any variant`)
    }

    const sku = generateUniqueSKU(product.name)

    return this.variantRepository.create({
      ...createVariantDto,
      product: product,
      sku,
    })
  }
  findVariantById(id: Variant['id']) {
    return this.variantRepository.findById(id)
  }
  async findProductVariants({
    productId,
    paginationOptions,
  }: {
    productId: Product['id']
    paginationOptions: IPaginationOptions
  }) {
    if (!productId) {
      throw new BadRequestException('Product ID is required')
    }
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new NotFoundException('Product not found')
    }
    return this.variantRepository.findAllByProductId({
      productId,
      paginationOptions,
    })
  }
  updateVariant(updateVariantDto: UpdateVariantDto) {}
  removeVariant(id: Variant['id']) {}
}

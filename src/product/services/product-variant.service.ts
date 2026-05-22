import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { ProductRepository } from 'product/domain/respositories/product.repository'
import { VariantRepository } from 'product/domain/respositories/variant.repository'
import { NotFoundException } from '@nestjs/common'
import { CreateVariantDto } from 'product/dto/variant/create-variant.dto'
import { Variant } from 'product/domain/variant'
import { Product } from 'product/domain/product'
import { UpdateVariantDto } from 'product/dto/variant/update-variant.dto'
import { generateUniqueSKU } from 'utils/slugify'
import { IPaginationOptions } from '../../utils/type/pagination-options'
// import { AttributesService } from 'attribute/attributes.service'

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: VariantRepository,
    // private readonly attributeService: AttributesService,
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
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'productNotFound',
        },
      })
    }

    const sku = generateUniqueSKU(product.name)

    const existingVariant = await this.variantRepository.findBySku(sku)

    if (existingVariant) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        errors: {
          status: 'skuAlreadyExists',
        },
      })
    }

    return this.variantRepository.create({
      ...createVariantDto,
      product: product,
      sku,
    })
  }
  findById(id: Variant['id']) {
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

  async updateVariant(id: Variant['id'], updateVariantDto: UpdateVariantDto) {
    const variant = await this.variantRepository.findById(id)
    if (!variant) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'variantNotExists',
        },
      })
    }
    return this.variantRepository.update(id, updateVariantDto)
  }
  removeVariant(id: Variant['id']) {
    return this.variantRepository.remove(id)
  }

  // attachAttributeValue(
  //   variantId: Variant['id'],
  //   attributeValueIds: AttributeValue['id'][],
  // ) {
  //   const values = this.attributeValueRepository.findByIds(attributeValueIds)
  //   if (!values || values.length === 0) {
  //     throw new BadRequestException('Invalid attribute value IDs')
  //   }
  //   return this.variantRepository.update(variantId, {
  //     attributeValues: [
  //       ...(variant.attributeValues || []),
  //       ...attributeValueIds,
  //     ],
  //   })
  // }
}

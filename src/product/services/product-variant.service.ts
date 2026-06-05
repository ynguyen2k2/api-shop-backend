import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { ProductRepository } from 'src/product/domain/respositories/product.repository'
import { VariantRepository } from 'src/product/domain/respositories/variant.repository'
import { NotFoundException } from '@nestjs/common'
import { CreateVariantDto } from 'src/product/dto/variant/create-variant.dto'
import { Variant } from 'src/product/domain/variant'
import { Product } from 'src/product/domain/product'
import { UpdateVariantDto } from 'src/product/dto/variant/update-variant.dto'
import { generateUniqueSKU } from 'src/utils/slugify'
import { IPaginationOptions } from '../../utils/type/pagination-options'
import { combineElement } from 'src/utils/generate/generate-element'
import { create } from 'node:domain'
import { CategoryAttributeService } from 'src/category/service/category-attribute.service'
// import { AttributesService } from 'src/attribute/attributes.service'

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly variantRepository: VariantRepository,
    private readonly categoryAttributeService: CategoryAttributeService,
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

  async generate(productId: Product['id'], createVariantDto: CreateVariantDto) {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          status: 'productNotFound',
        },
      })
    }
    if (!product.category || !product.category.id) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: {
          status: 'categoryRequired',
        },
      })
    }
    const result = await this.categoryAttributeService.findAllByCategory(
      product.category.id,
    )
    const attributes = result.map((item) => item.attribute)
    const valuesArray = attributes.map((attribute) => attribute.values || [])
    const combinations = combineElement(valuesArray)
    return await Promise.all(
      combinations.map((combination) => {
        const sku = generateUniqueSKU(product.name + combination.join('-'))
        return this.variantRepository.create({
          ...createVariantDto,
          product,
          sku,
        })
      }),
    )
  }
}

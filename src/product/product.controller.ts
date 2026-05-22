import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { CreateProductDto } from './dto/product/create-product.dto'
import { UpdateProductDto } from './dto/product/update-product.dto'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Product } from './domain/product'
import { AuthGuard } from '@nestjs/passport'
import { InfinityPaginationResponseDto } from '../utils/dto/infinity-pagination-response.dto'
import { infinityPagination } from '../utils/infinity-pagination'
import { FindAllProductsDto } from './dto/product/find-all-products.dto'
import { ProductService } from './services/product.service'
import { ProductVariantService } from 'src/product/services/product-variant.service'
import { ProductInventoryService } from 'src/product/services/product-inventory.service'
import { CreateVariantDto } from 'src/product/dto/variant/create-variant.dto'
import { UpdateVariantDto } from 'src/product/dto/variant/update-variant.dto'
import { FileDto } from 'src/files/dto/file-dto'
import { ProductImageService } from 'src/product/services/product-image.service'
import { ProductImage } from 'src/product/domain/product-image'
import { Inventory } from 'src/product/domain/inventory'
import { CreateInventoryDto } from 'src/product/dto/inventory/create-inventory.dto'

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'products',
  version: '1',
})
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly variantService: ProductVariantService,
    private readonly productImageService: ProductImageService,
    private readonly inventoryService: ProductInventoryService,
  ) {}

  // ──────────────────────────────────────────────
  //  Product CRUD
  // ──────────────────────────────────────────────

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @Get()
  async findAll(
    @Query() query: FindAllProductsDto,
  ): Promise<InfinityPaginationResponseDto<Product>> {
    const page = query?.page ?? 1
    let limit = query?.limit ?? 10
    if (limit > 50) {
      limit = 50
    }

    return infinityPagination(
      await this.productService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    )
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findById(@Param('id') id: string) {
    return this.productService.findById(id)
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto)
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.productService.remove(id)
  }

  // ──────────────────────────────────────────────
  //  Product Variants
  // ──────────────────────────────────────────────

  @Post(':id/variants')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async addVariant(
    @Param('id') productId: string,
    @Body()
    createVariantDto: CreateVariantDto,
  ) {
    return await this.variantService.createVariant(productId, createVariantDto)
  }

  @Get(':id/variants')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async findProductVariants(
    @Param('id') productId: string,
    @Query() query: FindAllProductsDto,
  ) {
    return await this.variantService.findProductVariants({
      productId,
      paginationOptions: {
        page: query?.page ?? 1,
        limit: query?.limit ?? 10,
      },
    })
  }

  @Get(':id/variants/:variantId')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
  })
  async findVariantById(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return await this.variantService.findById(variantId)
  }

  @Patch(':id/variants/:variantId')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
  })
  async updateVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return await this.variantService.updateVariant(variantId, updateVariantDto)
  }

  @Delete(':id/variants/:variantId')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async removeVariant(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return await this.variantService.removeVariant(variantId)
  }

  // ──────────────────────────────────────────────
  //  Product Images
  // ──────────────────────────────────────────────

  @Post(':id/images')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    type: ProductImage,
  })
  async attachImage(
    @Param('id') productId: string,
    @Body() attachImageDto: FileDto,
  ) {
    return await this.productImageService.attachImage(productId, attachImageDto)
  }

  @Delete(':id/images/:imageId')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiParam({
    name: 'imageId',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async removeImage(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return await this.productImageService.removeImage(productId, imageId)
  }

  @Patch(':id/images/reorder')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async reorderImages(
    @Param('id') productId: string,
    @Body() reorderImagesDto: ProductImage['id'][],
  ) {
    return await this.productImageService.reorderImages(
      productId,
      reorderImagesDto,
    )
  }

  // ──────────────────────────────────────────────
  //  Variant Inventory
  // ──────────────────────────────────────────────

  @Post(':id/variants/:variantId/inventory')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  @ApiCreatedResponse({
    type: Inventory,
  })
  async createInventory(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    return await this.inventoryService.createInventory({
      variantId,
      createInventoryDto,
    })
  }

  @Get(':id/variants/:variantId/inventory')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  async findVariantInventory(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return await this.inventoryService.findbyVariantId(variantId)
  }

  @Patch(':id/variants/:variantId/inventory/set-stock')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  async setStock(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.inventoryService.setStock(variantId, quantity)
  }

  @Patch(':id/variants/:variantId/inventory/increase-stock')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  async increaseStock(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.inventoryService.increaseStock(variantId, quantity)
  }

  @Patch(':id/variants/:variantId/inventory/decrease-stock')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  async decreaseStock(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.inventoryService.decreaseStock(variantId, quantity)
  }

  @Patch(':id/variants/:variantId/inventory/reserve')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  async reserveStock(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.inventoryService.reserveStock(variantId, quantity)
  }

  @Patch(':id/variants/:variantId/inventory/release')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  async releaseReservedStock(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
    @Body('quantity') quantity: number,
  ) {
    return await this.inventoryService.releaseReservedStock(variantId, quantity)
  }

  @Delete(':id/variants/:variantId/inventory')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Product ID',
  })
  @ApiParam({
    name: 'variantId',
    type: String,
    required: true,
    description: 'Variant ID',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async removeInventory(
    @Param('id') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return await this.inventoryService.removeInventory(variantId)
  }
}

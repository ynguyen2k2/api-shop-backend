import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { ProductService } from './services/product.service'
import { ProductController } from './product.controller'
import { RelationalProductPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { ProductVariantService } from 'src/product/services/product-variant.service'
import { ProductInventoryService } from 'src/product/services/product-inventory.service'
import { ProductImageService } from 'src/product/services/product-image.service'

@Module({
  imports: [
    // do not remove this comment
    RelationalProductPersistenceModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductVariantService,
    ProductInventoryService,
    ProductImageService,
  ],
  exports: [
    ProductService,
    RelationalProductPersistenceModule,
    ProductVariantService,
    ProductInventoryService,
    ProductImageService,
  ],
})
export class ProductModule {}

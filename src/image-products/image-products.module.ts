import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { ImageProductService } from './image-products.service'
import { ImageProductController } from './image-products.controller'
import { RelationalImageProductPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { ProductsModule } from '~/products/products.module'
import { FilesModule } from '~/files/file.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalImageProductPersistenceModule,
    FilesModule,
    ProductsModule,
  ],
  controllers: [ImageProductController],
  providers: [ImageProductService],
  exports: [ImageProductService, RelationalImageProductPersistenceModule],
})
export class ImageProductModule {}

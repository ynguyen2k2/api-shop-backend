import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { ImageProductService } from './image-products.service'
import { ImageProductController } from './image-products.controller'
import { RelationalimageProductPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalimageProductPersistenceModule,
  ],
  controllers: [ImageProductController],
  providers: [ImageProductService],
  exports: [ImageProductService, RelationalimageProductPersistenceModule],
})
export class ImageProductModule {}

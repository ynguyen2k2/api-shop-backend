import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { productImagesService } from './product-images.service'
import { productImagesController } from './product-images.controller'
import { RelationalproductImagePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalproductImagePersistenceModule,
  ],
  controllers: [productImagesController],
  providers: [productImagesService],
  exports: [productImagesService, RelationalproductImagePersistenceModule],
})
export class productImagesModule {}

import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { ProductService } from './services/product.service'
import { ProductController } from './product.controller'
import { RelationalProductPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalProductPersistenceModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, RelationalProductPersistenceModule],
})
export class ProductModule {}

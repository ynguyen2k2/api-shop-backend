import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'
import { RelationalReviewPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { UsersModule } from 'user/users.module'
import { ProductModule } from 'product/product.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalReviewPersistenceModule,
    UsersModule,
    ProductModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, RelationalReviewPersistenceModule],
})
export class ReviewModule {}

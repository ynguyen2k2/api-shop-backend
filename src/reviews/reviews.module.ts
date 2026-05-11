import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { ReviewService } from './reviews.service'
import { ReviewController } from './reviews.controller'
import { RelationalReviewPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalReviewPersistenceModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService, RelationalReviewPersistenceModule],
})
export class ReviewModule {}

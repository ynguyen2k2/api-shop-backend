import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'

@Module({
  imports: [
    // do not remove this comment
    RelationalCategoryPersistenceModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, RelationalCategoryPersistenceModule],
})
export class CategoryModule {}

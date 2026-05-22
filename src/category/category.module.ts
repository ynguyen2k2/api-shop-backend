import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { CategoryService } from './service/category.service'
import { CategoryController } from './controller/category.controller'
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { CategoryAttributeController } from 'category/controller/category-attribute.controller'
import { CategoryAttributeService } from 'category/service/category-attribute.service'
import { AttributesModule } from 'attribute/attributes.module'

@Module({
  imports: [RelationalCategoryPersistenceModule, AttributesModule],
  controllers: [CategoryController, CategoryAttributeController],
  providers: [CategoryService, CategoryAttributeService],
  exports: [
    CategoryService,
    CategoryAttributeService,
    RelationalCategoryPersistenceModule,
  ],
})
export class CategoryModule {}

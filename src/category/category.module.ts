import {
  // do not remove this comment
  Module,
} from '@nestjs/common'
import { CategoryService } from './service/category.service'
import { CategoryController } from './controller/category.controller'
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module'
import { CategoryAttributeController } from 'src/category/controller/category-attribute.controller'
import { CategoryAttributeService } from 'src/category/service/category-attribute.service'
import { AttributeModule } from 'src/attribute/attribute.module'

@Module({
  imports: [RelationalCategoryPersistenceModule, AttributeModule],
  controllers: [CategoryController, CategoryAttributeController],
  providers: [CategoryService, CategoryAttributeService],
  exports: [
    CategoryService,
    CategoryAttributeService,
    RelationalCategoryPersistenceModule,
  ],
})
export class CategoryModule {}

import { Module } from '@nestjs/common'
import { CategoryRelationalRepository } from './repositories/category.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from './entities/category.entity'
import { CategoryRepository } from 'category/domain/repositories/category.repository'
import { CategoryAttributeEntity } from 'category/infrastructure/persistence/relational/entities/category-attribute.entity'
import { CategoryAttributeRepository } from 'category/domain/repositories/category-attribute.respository'
import { CategoryAttributeRelationalRepository } from 'category/infrastructure/persistence/relational/repositories/category-attribute.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, CategoryAttributeEntity]),
  ],
  providers: [
    {
      provide: CategoryRepository,
      useClass: CategoryRelationalRepository,
    },
    {
      provide: CategoryAttributeRepository,
      useClass: CategoryAttributeRelationalRepository,
    },
  ],
  exports: [CategoryRepository, CategoryAttributeRepository],
})
export class RelationalCategoryPersistenceModule {}

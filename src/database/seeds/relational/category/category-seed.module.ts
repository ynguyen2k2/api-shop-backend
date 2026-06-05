import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from 'src/category/infrastructure/persistence/relational/entities/category.entity'
import { CategorySeedService } from 'src/database/seeds/relational/category/category-seed.service'

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategorySeedService],
  exports: [CategorySeedService],
})
export class CategorySeedModule {}

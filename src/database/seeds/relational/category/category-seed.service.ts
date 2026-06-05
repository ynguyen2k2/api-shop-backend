import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoryEntity } from 'src/category/infrastructure/persistence/relational/entities/category.entity'
import { categoriesSeed } from 'src/database/seeds/relational/category/category.seed'

@Injectable()
export class CategorySeedService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async run() {
    for (const categoryData of categoriesSeed) {
      let parent = await this.categoryRepository.findOne({
        where: {
          name: categoryData.name,
          slug: categoryData.slug,
        },
      })

      if (!parent) {
        parent = await this.categoryRepository.save(
          this.categoryRepository.create({
            name: categoryData.name,
            slug: categoryData.slug,
          }),
        )
      }

      for (const childData of categoryData.children) {
        const exists = await this.categoryRepository.findOne({
          where: {
            name: childData.name,
            slug: childData.slug,
            parent: {
              id: parent.id,
            },
          },
        })

        if (!exists) {
          await this.categoryRepository.save(
            this.categoryRepository.create({
              name: childData.name,
              slug: childData.slug,
              parent,
            }),
          )
        }
      }
    }
  }
}

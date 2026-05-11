import {
  BadRequestException,
  // common
  Injectable,
} from '@nestjs/common'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewRepository } from './infrastructure/persistence/review.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Review } from './domain/review'
import { UsersService } from '~/user/users.service'
import { ProductsService } from '~/products/products.service'
import { Product } from '~/products/domain/product'
import { User } from '~/user/domain/user'

@Injectable()
export class ReviewService {
  constructor(
    // Dependencies here
    private readonly reviewRepository: ReviewRepository,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createReviewDto: CreateReviewDto,
  ) {
    const userId = createReviewDto.user.id
    const user = await this.usersService.findById(userId)
    const productId = createReviewDto.product.id
    const product = await this.productsService.findById(productId)
    if (!user) {
      throw new BadRequestException("User doesn't exist")
    }
    if (!product) {
      throw new BadRequestException("Product doesn't exist")
    }

    return this.reviewRepository.create({
      ...createReviewDto,
      user,
      product,
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.reviewRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: Review['id']) {
    return this.reviewRepository.findById(id)
  }

  findByIds(ids: Review['id'][]) {
    return this.reviewRepository.findByIds(ids)
  }

  async update(
    id: Review['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateReviewDto: UpdateReviewDto,
  ) {
    let user: User | null = null
    let product: Product | null = null
    if (updateReviewDto.user) {
      const userId = updateReviewDto.user.id
      user = await this.usersService.findById(userId)
    }

    if (updateReviewDto.product) {
      const productId = updateReviewDto.product.id
      product = await this.productsService.findById(productId)
    }
    if (!user) {
      throw new BadRequestException("User doesn't exist")
    }
    if (!product) {
      throw new BadRequestException("Product doesn't exist")
    }
    return this.reviewRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: Review['id']) {
    return this.reviewRepository.remove(id)
  }
}

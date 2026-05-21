import {
  BadRequestException,
  ForbiddenException,
  // common
  Injectable,
} from '@nestjs/common'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewRepository } from './infrastructure/persistence/review.repository'
import { IPaginationOptions } from 'utils/type/pagination-options'
import { Review } from './domain/review'
import { UserService } from 'user/users.service'
import { Product } from 'product/domain/product'
import { User } from 'user/domain/user'
import { ProductService } from 'product/services/product.service'

@Injectable()
export class ReviewService {
  constructor(
    // Dependencies here
    private readonly reviewRepository: ReviewRepository,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  private async validateReviewOwner(id: Review['id'], userId: User['id']) {
    const review = await this.reviewRepository.findById(id)
    if (!review) {
      throw new BadRequestException("Review doesn't exist")
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException("User doesn't own this review")
    }
    return review
  }

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createReviewDto: CreateReviewDto,
  ) {
    const userId = createReviewDto.user.id
    const user = await this.userService.findById(userId)
    const productId = createReviewDto.product.id
    const product = await this.productService.findById(productId)

    if (!user) {
      throw new BadRequestException("User doesn't exist")
    }
    if (!product) {
      throw new BadRequestException("Product doesn't exist")
    }

    const oldReview = await this.reviewRepository.findUserAndProduct(
      userId,
      productId,
    )
    if (oldReview) {
      throw new BadRequestException(
        'User already has a review for this product',
      )
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
  findAllByProductId({
    productId,
    paginationOptions,
  }: {
    productId: Product['id']
    paginationOptions: IPaginationOptions
  }) {
    return this.reviewRepository.findAllByProductId({
      productId,
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }
  findAllByUserId({
    userId,
    paginationOptions,
  }: {
    userId: User['id']
    paginationOptions: IPaginationOptions
  }) {
    return this.reviewRepository.findAllByUserId({
      userId,
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }
  findUserAndProduct(userId: User['id'], productId: Product['id']) {
    return this.reviewRepository.findUserAndProduct(userId, productId)
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
      user = await this.userService.findById(userId)
    }

    if (!user) {
      throw new BadRequestException("User doesn't exist")
    }

    if (updateReviewDto.product) {
      const productId = updateReviewDto.product.id
      product = await this.productService.findById(productId)
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

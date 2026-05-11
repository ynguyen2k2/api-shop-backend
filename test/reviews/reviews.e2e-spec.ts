import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { ReviewService } from '~/reviews/reviews.service'
import { ReviewRepository } from '~/reviews/infrastructure/persistence/review.repository'
import { UsersService } from '~/user/users.service'
import { ProductsService } from '~/products/products.service'
import { CreateReviewDto } from '~/reviews/dto/create-review.dto'
import { UpdateReviewDto } from '~/reviews/dto/update-review.dto'
import { Review } from '~/reviews/domain/review'
import { User } from '~/user/domain/user'
import { Product } from '~/products/domain/product'

// ─── Mock Data ──────────────────────────────────────────────────

const mockUser: User = {
  id: 1,
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockProduct: Product = {
  id: 1,
  name: 'iPhone 16 Pro',
  slug: 'iphone-16-pro',
  brand: 'Apple',
  category: 'Smartphones',
  isActive: true,
  isFeatured: true,
  isNew: true,
  averageRating: 4.8,
  totalReviews: 120,
  variants: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

const mockReview: Review = {
  id: 1,
  user: mockUser,
  product: mockProduct,
  rating: 5,
  comment: 'Amazing product!',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  isActive: true,
}

const mockReview2: Review = {
  id: 2,
  user: mockUser,
  product: mockProduct,
  rating: 3,
  comment: 'Decent, but overpriced.',
  createdAt: new Date('2026-01-02'),
  updatedAt: new Date('2026-01-02'),
  isActive: true,
}

// ─── Mock Providers ─────────────────────────────────────────────

const mockReviewRepository = {
  create: jest.fn(),
  findAllWithPagination: jest.fn(),
  findById: jest.fn(),
  findByIds: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

const mockUsersService = {
  findById: jest.fn(),
}

const mockProductsService = {
  findById: jest.fn(),
}

// ─── Test Suite ─────────────────────────────────────────────────

describe('ReviewService', () => {
  let service: ReviewService
  let reviewRepository: typeof mockReviewRepository
  let usersService: typeof mockUsersService
  let productsService: typeof mockProductsService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: ReviewRepository,
          useValue: mockReviewRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile()

    service = module.get<ReviewService>(ReviewService)
    reviewRepository = mockReviewRepository
    usersService = mockUsersService
    productsService = mockProductsService
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    const dto: CreateReviewDto = {
      user: { id: 1 },
      product: { id: '1' },
      rating: 5,
      comment: 'Amazing product!',
    }

    it('should create a review when user and product exist', async () => {
      usersService.findById.mockResolvedValue(mockUser)
      productsService.findById.mockResolvedValue(mockProduct)
      reviewRepository.create.mockResolvedValue(mockReview)

      const result = await service.create(dto)

      expect(usersService.findById).toHaveBeenCalledWith(1)
      expect(productsService.findById).toHaveBeenCalledWith('1')
      expect(reviewRepository.create).toHaveBeenCalledWith({
        ...dto,
        user: mockUser,
        product: mockProduct,
      })
      expect(result).toEqual(mockReview)
    })

    it('should throw BadRequestException when user does not exist', async () => {
      usersService.findById.mockResolvedValue(null)
      productsService.findById.mockResolvedValue(mockProduct)

      await expect(service.create(dto)).rejects.toThrow(BadRequestException)
      await expect(service.create(dto)).rejects.toThrow("User doesn't exist")

      expect(reviewRepository.create).not.toHaveBeenCalled()
    })

    it('should throw BadRequestException when product does not exist', async () => {
      usersService.findById.mockResolvedValue(mockUser)
      productsService.findById.mockResolvedValue(null)

      await expect(service.create(dto)).rejects.toThrow(BadRequestException)
      await expect(service.create(dto)).rejects.toThrow(
        "Product doesn't exist",
      )

      expect(reviewRepository.create).not.toHaveBeenCalled()
    })

    it('should throw BadRequestException when both user and product do not exist', async () => {
      usersService.findById.mockResolvedValue(null)
      productsService.findById.mockResolvedValue(null)

      // user check comes first in the service
      await expect(service.create(dto)).rejects.toThrow("User doesn't exist")

      expect(reviewRepository.create).not.toHaveBeenCalled()
    })

    it('should return the created review with correct properties', async () => {
      usersService.findById.mockResolvedValue(mockUser)
      productsService.findById.mockResolvedValue(mockProduct)
      reviewRepository.create.mockResolvedValue(mockReview)

      const result = await service.create(dto)

      expect(result.id).toBe(1)
      expect(result.rating).toBe(5)
      expect(result.comment).toBe('Amazing product!')
      expect(result.isActive).toBe(true)
      expect(result.user).toEqual(mockUser)
      expect(result.product).toEqual(mockProduct)
    })
  })

  // ──────────────────────────────────────────────
  // findAllWithPagination()
  // ──────────────────────────────────────────────
  describe('findAllWithPagination', () => {
    it('should return paginated reviews', async () => {
      const data = [mockReview, mockReview2]
      reviewRepository.findAllWithPagination.mockResolvedValue(data)

      const result = await service.findAllWithPagination({
        paginationOptions: { page: 1, limit: 10 },
      })

      expect(reviewRepository.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result).toEqual(data)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no reviews exist', async () => {
      reviewRepository.findAllWithPagination.mockResolvedValue([])

      const result = await service.findAllWithPagination({
        paginationOptions: { page: 1, limit: 10 },
      })

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('should forward pagination options correctly', async () => {
      reviewRepository.findAllWithPagination.mockResolvedValue([])

      await service.findAllWithPagination({
        paginationOptions: { page: 3, limit: 25 },
      })

      expect(reviewRepository.findAllWithPagination).toHaveBeenCalledWith({
        paginationOptions: { page: 3, limit: 25 },
      })
    })
  })

  // ──────────────────────────────────────────────
  // findById()
  // ──────────────────────────────────────────────
  describe('findById', () => {
    it('should return the review by id', async () => {
      reviewRepository.findById.mockResolvedValue(mockReview)

      const result = await service.findById(1)

      expect(reviewRepository.findById).toHaveBeenCalledWith(1)
      expect(reviewRepository.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockReview)
    })

    it('should return null when review is not found', async () => {
      reviewRepository.findById.mockResolvedValue(null)

      const result = await service.findById(999)

      expect(reviewRepository.findById).toHaveBeenCalledWith(999)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // findByIds()
  // ──────────────────────────────────────────────
  describe('findByIds', () => {
    it('should return reviews by ids', async () => {
      const data = [mockReview, mockReview2]
      reviewRepository.findByIds.mockResolvedValue(data)

      const result = await service.findByIds([1, 2])

      expect(reviewRepository.findByIds).toHaveBeenCalledWith([1, 2])
      expect(result).toEqual(data)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no matching ids', async () => {
      reviewRepository.findByIds.mockResolvedValue([])

      const result = await service.findByIds([999, 888])

      expect(reviewRepository.findByIds).toHaveBeenCalledWith([999, 888])
      expect(result).toEqual([])
    })
  })

  // ──────────────────────────────────────────────
  // update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    const dto: UpdateReviewDto = {
      user: { id: 1 },
      product: { id: '1' },
      rating: 4,
      comment: 'Updated review',
    }

    it('should update a review when user and product exist', async () => {
      usersService.findById.mockResolvedValue(mockUser)
      productsService.findById.mockResolvedValue(mockProduct)
      const updatedReview = { ...mockReview, rating: 4 }
      reviewRepository.update.mockResolvedValue(updatedReview)

      const result = await service.update(1, dto)

      expect(usersService.findById).toHaveBeenCalledWith(1)
      expect(productsService.findById).toHaveBeenCalledWith('1')
      expect(reviewRepository.update).toHaveBeenCalledWith(1, {
        // Do not remove comment below.
        // <updating-property-payload />
      })
      expect(result).toEqual(updatedReview)
    })

    it('should throw BadRequestException when user does not exist on update', async () => {
      usersService.findById.mockResolvedValue(null)
      productsService.findById.mockResolvedValue(mockProduct)

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException)
      await expect(service.update(1, dto)).rejects.toThrow(
        "User doesn't exist",
      )

      expect(reviewRepository.update).not.toHaveBeenCalled()
    })

    it('should throw BadRequestException when product does not exist on update', async () => {
      usersService.findById.mockResolvedValue(mockUser)
      productsService.findById.mockResolvedValue(null)

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException)
      await expect(service.update(1, dto)).rejects.toThrow(
        "Product doesn't exist",
      )

      expect(reviewRepository.update).not.toHaveBeenCalled()
    })

    it('should throw when updating without user in dto', async () => {
      const dtoWithoutUser: UpdateReviewDto = {
        product: { id: '1' },
        rating: 4,
      }

      productsService.findById.mockResolvedValue(mockProduct)

      // user is not in dto, so usersService.findById is not called → user stays null → throws
      await expect(service.update(1, dtoWithoutUser)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw when updating without product in dto', async () => {
      const dtoWithoutProduct: UpdateReviewDto = {
        user: { id: 1 },
        rating: 4,
      }

      usersService.findById.mockResolvedValue(mockUser)

      // product is not in dto, so productsService.findById is not called → product stays null → throws
      await expect(service.update(1, dtoWithoutProduct)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should return null when repository returns null', async () => {
      usersService.findById.mockResolvedValue(mockUser)
      productsService.findById.mockResolvedValue(mockProduct)
      reviewRepository.update.mockResolvedValue(null)

      const result = await service.update(999, dto)

      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a review by id', async () => {
      reviewRepository.remove.mockResolvedValue(undefined)

      const result = await service.remove(1)

      expect(reviewRepository.remove).toHaveBeenCalledWith(1)
      expect(reviewRepository.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

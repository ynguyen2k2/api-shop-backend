import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '~/user/users.controller'
import { UsersService } from '~/user/users.service'
import { CreateUserDto } from '~/user/dto/create-user.dto'
import { UpdateUserDto } from '~/user/dto/update-user.dto'
import { SortUserDto } from '~/user/dto/query-user.dto'
import { User } from '~/user/domain/user'

// ──────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────

const now = new Date('2026-01-01T00:00:00Z')

const mockUser: User = {
  id: 1,
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  provider: 'email',
  socialId: null,
  photo: null,
  role: { id: 2 },
  status: { id: 2 },
  createdAt: now,
  updatedAt: now,
  deletedAt: now,
}

const mockUser2: User = {
  id: 2,
  email: 'jane.smith@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  provider: 'email',
  socialId: null,
  photo: null,
  role: { id: 2 },
  status: { id: 2 },
  createdAt: now,
  updatedAt: now,
  deletedAt: now,
}

const mockAdminUser: User = {
  id: 3,
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  provider: 'email',
  socialId: null,
  photo: null,
  role: { id: 1 },
  status: { id: 2 },
  createdAt: now,
  updatedAt: now,
  deletedAt: now,
}

// ──────────────────────────────────────────────
// Mock service
// ──────────────────────────────────────────────

const mockUsersService = {
  create: jest.fn(),
  findManyWithPagination: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}

describe('UsersController', () => {
  let controller: UsersController
  let service: typeof mockUsersService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = mockUsersService
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // ──────────────────────────────────────────────
  // POST /users  →  create()
  // ──────────────────────────────────────────────
  describe('create', () => {
    it('should create a user with required fields', async () => {
      const dto: CreateUserDto = {
        email: 'new.user@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      }

      service.create.mockResolvedValue({
        ...mockUser,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      })

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(service.create).toHaveBeenCalledTimes(1)
      expect(result.email).toBe('new.user@example.com')
      expect(result.firstName).toBe('New')
      expect(result.lastName).toBe('User')
    })

    it('should create a user with role and status', async () => {
      const dto: CreateUserDto = {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: { id: 1 },
        status: { id: 2 },
      }

      service.create.mockResolvedValue(mockAdminUser)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(result.role).toEqual({ id: 1 })
      expect(result.status).toEqual({ id: 2 })
    })

    it('should create a user with photo', async () => {
      const dto: CreateUserDto = {
        email: 'photo.user@example.com',
        firstName: 'Photo',
        lastName: 'User',
        photo: { id: 'photo-uuid', path: '/uploads/avatar.jpg' },
      }

      const userWithPhoto: User = {
        ...mockUser,
        photo: { id: 'photo-uuid', path: '/uploads/avatar.jpg' },
      }
      service.create.mockResolvedValue(userWithPhoto)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(result.photo).toEqual({
        id: 'photo-uuid',
        path: '/uploads/avatar.jpg',
      })
    })
  })

  // ──────────────────────────────────────────────
  // GET /users  →  findAll()
  // ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated users', async () => {
      const data = [mockUser, mockUser2]
      service.findManyWithPagination.mockResolvedValue(data)

      const result = await controller.findAll({ page: 1, limit: 10 })

      expect(service.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: undefined,
        sortOptions: undefined,
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toEqual(data)
      expect(result.hasNextPage).toBe(false) // 2 items < limit of 10
    })

    it('should default to page 1 and limit 10 when query is empty', async () => {
      service.findManyWithPagination.mockResolvedValue([])

      const result = await controller.findAll({})

      expect(service.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: undefined,
        sortOptions: undefined,
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toEqual([])
      expect(result.hasNextPage).toBe(false)
    })

    it('should cap limit at 50', async () => {
      service.findManyWithPagination.mockResolvedValue([])

      await controller.findAll({ page: 1, limit: 100 })

      expect(service.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: undefined,
        sortOptions: undefined,
        paginationOptions: { page: 1, limit: 50 },
      })
    })

    it('should report hasNextPage true when data length equals limit', async () => {
      const items = Array.from({ length: 5 }, (_, i) => ({
        ...mockUser,
        id: i + 1,
      }))
      service.findManyWithPagination.mockResolvedValue(items)

      const result = await controller.findAll({ page: 1, limit: 5 })

      expect(result.hasNextPage).toBe(true)
    })

    it('should pass filter options to the service', async () => {
      const filters = { roles: [{ id: 1 }] }
      service.findManyWithPagination.mockResolvedValue([mockAdminUser])

      const result = await controller.findAll({
        page: 1,
        limit: 10,
        filters,
      })

      expect(service.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: filters,
        sortOptions: undefined,
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toEqual([mockAdminUser])
    })

    it('should pass sort options to the service', async () => {
      const sort = [{ orderBy: 'createdAt' as keyof User, order: 'DESC' }] as SortUserDto[]
      service.findManyWithPagination.mockResolvedValue([mockUser2, mockUser])

      const result = await controller.findAll({
        page: 1,
        limit: 10,
        sort,
      })

      expect(service.findManyWithPagination).toHaveBeenCalledWith({
        filterOptions: undefined,
        sortOptions: sort,
        paginationOptions: { page: 1, limit: 10 },
      })
      expect(result.data).toHaveLength(2)
    })
  })

  // ──────────────────────────────────────────────
  // GET /users/:id  →  findOne()
  // ──────────────────────────────────────────────
  describe('findOne', () => {
    it('should return a user by id', async () => {
      service.findById.mockResolvedValue(mockUser)

      const result = await controller.findOne(1)

      expect(service.findById).toHaveBeenCalledWith(1)
      expect(service.findById).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockUser)
    })

    it('should return null when user is not found', async () => {
      service.findById.mockResolvedValue(null)

      const result = await controller.findOne(999)

      expect(service.findById).toHaveBeenCalledWith(999)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // PATCH /users/:id  →  update()
  // ──────────────────────────────────────────────
  describe('update', () => {
    it('should update user name fields', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'Name',
      }
      const updatedUser = { ...mockUser, ...dto }

      service.update.mockResolvedValue(updatedUser)

      const result = await controller.update(1, dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(service.update).toHaveBeenCalledTimes(1)
      expect(result!.firstName).toBe('Updated')
      expect(result!.lastName).toBe('Name')
    })

    it('should update user email', async () => {
      const dto: UpdateUserDto = {
        email: 'updated@example.com',
      }
      const updatedUser = { ...mockUser, email: 'updated@example.com' }

      service.update.mockResolvedValue(updatedUser)

      const result = await controller.update(1, dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(result!.email).toBe('updated@example.com')
    })

    it('should update user role', async () => {
      const dto: UpdateUserDto = {
        role: { id: 1 },
      }
      const updatedUser = { ...mockUser, role: { id: 1 } }

      service.update.mockResolvedValue(updatedUser)

      const result = await controller.update(1, dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(result!.role).toEqual({ id: 1 })
    })

    it('should update user status', async () => {
      const dto: UpdateUserDto = {
        status: { id: 1 },
      }
      const updatedUser = { ...mockUser, status: { id: 1 } }

      service.update.mockResolvedValue(updatedUser)

      const result = await controller.update(1, dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(result!.status).toEqual({ id: 1 })
    })

    it('should update user photo', async () => {
      const dto: UpdateUserDto = {
        photo: { id: 'new-photo-id', path: '/uploads/new-avatar.jpg' },
      }
      const updatedUser = {
        ...mockUser,
        photo: { id: 'new-photo-id', path: '/uploads/new-avatar.jpg' },
      }

      service.update.mockResolvedValue(updatedUser)

      const result = await controller.update(1, dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(result!.photo).toEqual({
        id: 'new-photo-id',
        path: '/uploads/new-avatar.jpg',
      })
    })

    it('should return null when user to update is not found', async () => {
      const dto: UpdateUserDto = { firstName: 'Ghost' }

      service.update.mockResolvedValue(null)

      const result = await controller.update(999, dto)

      expect(service.update).toHaveBeenCalledWith(999, dto)
      expect(result).toBeNull()
    })
  })

  // ──────────────────────────────────────────────
  // DELETE /users/:id  →  remove()
  // ──────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a user by id', async () => {
      service.remove.mockResolvedValue(undefined)

      const result = await controller.remove(1)

      expect(service.remove).toHaveBeenCalledWith(1)
      expect(service.remove).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })
  })
})

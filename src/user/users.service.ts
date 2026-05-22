import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common'
import { User } from 'src/user/domain/user'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserRepository } from 'src/user/infrastructure/persistence/user-repository'
import bcrypt from 'bcrypt'
import { FileType } from 'src/files/domain/file'
import { FilesService } from 'src/files/file.service'
import { Role } from 'src/roles/domain/role'
import { RoleEnum } from 'src/roles/roles-enum'
import { Status } from 'src/statuses/domain/status'
import { StatusEnum } from 'src/statuses/status-enum'
import { FilterUserDto, SortUserDto } from 'src/user/dto/query-user.dto'
import { IPaginationOptions } from 'src/utils/type/pagination-options'
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum'
import { NullableType } from 'src/utils/type/nullable.type'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { MyLogger } from 'src/logger/mylogger.service'
@Injectable()
export class UserService {
  constructor(
    private readonly logger: MyLogger,
    private readonly usersRepository: UserRepository,
    private readonly filesService: FilesService,
  ) {
    this.logger.setContext(UserService.name)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Do not remove comment below.
    // <creating-property />
    let password: string | undefined = undefined

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt()
      password = await bcrypt.hash(createUserDto.password, salt)
    }

    let email: string | null = null

    if (createUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        createUserDto.email,
      )
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        })
      }
      email = createUserDto.email
    }

    let photo: FileType | null | undefined = undefined

    if (createUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        createUserDto.photo.id,
      )
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        })
      }
      photo = fileObject
    } else if (createUserDto.photo === null) {
      photo = null
    }

    let role: Role | undefined = undefined

    if (createUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(createUserDto.role.id))
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        })
      }

      role = {
        id: createUserDto.role.id,
      }
    }

    let status: Status | undefined = undefined

    if (createUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(createUserDto.status.id))
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        })
      }

      status = {
        id: createUserDto.status.id,
      }
    }

    return this.usersRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      photo: photo,
      role: role,
      status: status,
      provider: createUserDto.provider ?? AuthProvidersEnum.EMAIL,
      socialId: createUserDto.socialId,
    })
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null
    sortOptions?: SortUserDto[] | null
    paginationOptions: IPaginationOptions
  }): Promise<User[]> {
    return this.usersRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    })
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id)
  }

  findByIds(ids: User['id'][]): Promise<User[]> {
    return this.usersRepository.findByIds(ids)
  }

  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email)
  }

  // findBySocialIdAndProvider({
  //   socialId,
  //   provider,
  // }: {
  //   socialId: User['socialId']
  //   provider: User['provider']
  // }): Promise<NullableType<User>> {
  //   return this.usersRepository.findBySocialIdAndProvider({
  //     socialId,
  //     provider,
  //   })
  // }

  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    // Do not remove comment below.
    // <updating-property />

    let password: string | undefined = undefined

    if (updateUserDto.password) {
      const userObject = await this.usersRepository.findById(id)

      if (userObject && userObject?.password !== updateUserDto.password) {
        const salt = await bcrypt.genSalt()
        password = await bcrypt.hash(updateUserDto.password, salt)
      }
    }

    let email: string | null | undefined = undefined

    if (updateUserDto.email) {
      const userObject = await this.usersRepository.findByEmail(
        updateUserDto.email,
      )

      if (userObject && userObject.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        })
      }

      email = updateUserDto.email
    } else if (updateUserDto.email === null) {
      email = null
    }

    let photo: FileType | null | undefined = undefined

    if (updateUserDto.photo?.id) {
      const fileObject = await this.filesService.findById(
        updateUserDto.photo.id,
      )
      if (!fileObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            photo: 'imageNotExists',
          },
        })
      }
      photo = fileObject
    } else if (updateUserDto.photo === null) {
      photo = null
    }

    let role: Role | undefined = undefined

    if (updateUserDto.role?.id) {
      const roleObject = Object.values(RoleEnum)
        .map(String)
        .includes(String(updateUserDto.role.id))
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        })
      }

      role = {
        id: updateUserDto.role.id,
      }
    }

    let status: Status | undefined = undefined

    if (updateUserDto.status?.id) {
      const statusObject = Object.values(StatusEnum)
        .map(String)
        .includes(String(updateUserDto.status.id))
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        })
      }

      status = {
        id: updateUserDto.status.id,
      }
    }

    return this.usersRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      photo,
      role,
      status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
    })
  }

  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id)
  }
}

import { IPaginationOptions } from 'utils/type/pagination-options'
import { FilterUserDto, SortUserDto } from '../../dto/query-user.dto'
import { User } from 'user/domain/user'
import { NullableType } from 'utils/type/nullable.type'
import { DeepPartial } from 'utils/type/deep-partial.type'

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>,
  ): Promise<User>

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null
    sortOptions?: SortUserDto[] | null
    paginationOptions: IPaginationOptions
  }): Promise<User[]>

  abstract findById(id: User['id']): Promise<NullableType<User>>
  abstract findByIds(ids: User['id'][]): Promise<User[]>
  abstract findByEmail(email: User['email']): Promise<NullableType<User>>
  // abstract findBySocialIdAndProvider({
  //   socialId,
  //   provider,
  // }: {
  //   socialId: User['socialId']
  //   provider: User['provider']
  // }): Promise<NullableType<User>>

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>

  abstract remove(id: User['id']): Promise<void>
}

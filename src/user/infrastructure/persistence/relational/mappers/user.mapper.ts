import { User } from 'src/user/domain/user'
import { UserEntity } from '../entities/user.entity'
import { FileMapper } from 'src/files/infrastructure/persistence/relational/mappers/file-mapper'
import { RoleEntity } from 'src/roles/infrastructure/persistence/relational/entities/role.entity'
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity'
import { StatusEntity } from 'src/statuses/infrastucture/persistence/relational/entities/status.entity'

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User()
    domainEntity.id = raw.id
    domainEntity.email = raw.email
    domainEntity.password = raw.password
    domainEntity.provider = raw.provider
    domainEntity.socialId = raw.socialId
    domainEntity.firstName = raw.firstName
    domainEntity.lastName = raw.lastName
    if (raw.photo) {
      domainEntity.photo = FileMapper.toDomain(raw.photo)
    }
    domainEntity.role = raw.role
    domainEntity.status = raw.status
    domainEntity.createdAt = raw.createdAt
    domainEntity.updatedAt = raw.updatedAt
    domainEntity.isActive = raw.isActive
    return domainEntity
  }

  static toPersistence(domainEntity: User): UserEntity {
    let role: RoleEntity | undefined = undefined

    if (domainEntity.role) {
      role = new RoleEntity()
      role.id = Number(domainEntity.role.id)
    }

    let photo: FileEntity | undefined | null = undefined

    if (domainEntity.photo) {
      photo = new FileEntity()
      photo.id = domainEntity.photo.id
      photo.path = domainEntity.photo.path
    } else if (domainEntity.photo === null) {
      photo = null
    }

    let status: StatusEntity | undefined = undefined

    if (domainEntity.status) {
      status = new StatusEntity()
      status.id = Number(domainEntity.status.id)
    }

    const persistenceEntity = new UserEntity()
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id
    }
    persistenceEntity.email = domainEntity.email
    persistenceEntity.password = domainEntity.password
    persistenceEntity.provider = domainEntity.provider
    persistenceEntity.socialId = domainEntity.socialId
    persistenceEntity.firstName = domainEntity.firstName
    persistenceEntity.lastName = domainEntity.lastName
    persistenceEntity.photo = photo
    persistenceEntity.role = role
    persistenceEntity.status = status
    persistenceEntity.createdAt = domainEntity.createdAt
    persistenceEntity.updatedAt = domainEntity.updatedAt
    persistenceEntity.isActive = domainEntity.isActive
    return persistenceEntity
  }
}

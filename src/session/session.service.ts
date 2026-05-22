import { Injectable } from '@nestjs/common'
import { Session } from 'src/session/domain/session'
import { SessionRepository } from 'src/session/infrastucture/persistence/session.respository'
import { User } from 'src/user/domain/user'
import { NullableType } from 'src/utils/type/nullable.type'

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(id: Session['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(id)
  }

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data)
  }

  update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload)
  }

  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id)
  }

  deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    return this.sessionRepository.deleteByUserId(conditions)
  }

  deleteByUserIdWithExclude(conditions: {
    userId: User['id']
    excludeSessionId: Session['id']
  }): Promise<void> {
    return this.sessionRepository.deleteByUserIdWithExclude(conditions)
  }
}

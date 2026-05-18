import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { SessionEntity } from '../entities/session.entity'
import { SessionRepository } from '~/session/infrastucture/persistence/session.respository'
import { Session } from '~/session/domain/session'
import { NullableType } from '~/utils/type/nullable.type'
import { SessionMapper } from '~/session/infrastucture/persistence/relational/mapper/session.mapper'
import { User } from '~/user/domain/user'

@Injectable()
export class SessionRelationalRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: {
        id: id,
      },
    })

    return entity ? SessionMapper.toDomain(entity) : null
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data)
    const createdModel = await this.sessionRepository.save(persistenceModel)
    return SessionMapper.toDomain(createdModel)
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const entity = await this.sessionRepository.findOne({
      where: { id: id },
    })

    if (!entity) {
      throw new Error('Session not found')
    }

    const updatedEntity = await this.sessionRepository.save(
      this.sessionRepository.create(
        SessionMapper.toPersistence({
          ...SessionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    )

    return SessionMapper.toDomain(updatedEntity)
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.sessionRepository.softDelete({
      id: id,
    })
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    await this.sessionRepository.softDelete({
      user: {
        id: conditions.userId,
      },
    })
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: User['id']
    excludeSessionId: Session['id']
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      user: {
        id: conditions.userId,
      },
      id: Not(conditions.excludeSessionId),
    })
  }
}

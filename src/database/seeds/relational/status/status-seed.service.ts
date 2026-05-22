import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StatusEntity } from 'src/statuses/infrastucture/persistence/relational/entities/status.entity'
import { StatusEnum } from 'src/statuses/status-enum'

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(StatusEntity)
    private repository: Repository<StatusEntity>,
  ) {}

  async run() {
    const count = await this.repository.count()

    if (!count) {
      await this.repository.save([
        this.repository.create({
          id: StatusEnum.ACTIVE,
          name: 'Active',
        }),
        this.repository.create({
          id: StatusEnum.INACTIVE,
          name: 'Inactive',
        }),
      ])
    }
  }
}

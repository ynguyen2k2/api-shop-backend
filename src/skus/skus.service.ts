import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateskuDto } from './dto/create-sku.dto'
import { UpdateskuDto } from './dto/update-sku.dto'
import { skuRepository } from './infrastructure/persistence/sku.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { sku } from './domain/sku'

@Injectable()
export class skusService {
  constructor(
    // Dependencies here
    private readonly skuRepository: skuRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createskuDto: CreateskuDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.skuRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.skuRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: sku['id']) {
    return this.skuRepository.findById(id)
  }

  findByIds(ids: sku['id'][]) {
    return this.skuRepository.findByIds(ids)
  }

  async update(
    id: sku['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateskuDto: UpdateskuDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.skuRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: sku['id']) {
    return this.skuRepository.remove(id)
  }
}

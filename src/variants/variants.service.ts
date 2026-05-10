import {
  // common
  Injectable,
} from '@nestjs/common'
import { CreateVariantDto } from './dto/create-variant.dto'
import { UpdateVariantDto } from './dto/update-variant.dto'
import { VariantRepository } from './infrastructure/persistence/variant.repository'
import { IPaginationOptions } from '~/utils/type/pagination-options'
import { Variant } from './domain/variant'

@Injectable()
export class VariantService {
  constructor(
    // Dependencies here
    private readonly variantRepository: VariantRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createVariantDto: CreateVariantDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.variantRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    })
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions
  }) {
    return this.variantRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    })
  }

  findById(id: Variant['id']) {
    return this.variantRepository.findById(id)
  }

  findByIds(ids: Variant['id'][]) {
    return this.variantRepository.findByIds(ids)
  }

  async update(
    id: Variant['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateVariantDto: UpdateVariantDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.variantRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    })
  }

  remove(id: Variant['id']) {
    return this.variantRepository.remove(id)
  }
}

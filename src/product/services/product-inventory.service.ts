import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InventoryRepository } from 'product/domain/respositories/inventory.repository'
import { VariantRepository } from 'product/domain/respositories/variant.repository'
import { CreateInventoryDto } from 'product/dto/inventory/create-inventory.dto'
import { VariantDto } from 'product/dto/variant/variant.dto'

export class ProductInventoryService {
  constructor(
    private readonly variantRepository: VariantRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}
  async createInventory({
    variantId,
    createInventoryDto,
  }: {
    variantId: VariantDto['id']
    createInventoryDto: CreateInventoryDto
  }) {
    const variant = await this.variantRepository.findById(variantId)

    if (!variant) {
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'variantNotFound',
        },
      })
    }

    const existingInventory =
      await this.inventoryRepository.findByVariantId(variantId)

    if (existingInventory) {
      throw new ConflictException({
        HttpStatus: HttpStatus.CONFLICT,
        errors: {
          status: 'inventoryAlreadyExists',
        },
      })
    }

    return this.inventoryRepository.create({
      ...createInventoryDto,
      variant,
    })
  }

  async findbyVariantId(variantId: VariantDto['id']) {
    const inventory = await this.inventoryRepository.findByVariantId(variantId)

    if (!inventory) {
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'inventoryNotFound',
        },
      })
    }

    return inventory
  }

  async setStock(variantId: VariantDto['id'], quantity: number) {
    if (quantity < 0) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        errors: {
          status: 'invalidQuantity',
        },
      })
    }

    const inventory = await this.findbyVariantId(variantId)

    inventory.quantity = quantity

    return this.inventoryRepository.save(inventory)
  }

  async increaseStock(variantId: VariantDto['id'], quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        errors: {
          status: 'invalidQuantity',
        },
      })
    }

    const inventory = await this.findbyVariantId(variantId)

    inventory.quantity += quantity

    return this.inventoryRepository.save(inventory)
  }

  async decreaseStock(variantId: VariantDto['id'], quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        errors: {
          status: 'invalidQuantity',
        },
      })
    }

    const inventory = await this.findbyVariantId(variantId)

    const availableStock = inventory.quantity - inventory.reserved

    if (availableStock < quantity) {
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'insufficientStock',
        },
      })
    }

    inventory.quantity -= quantity

    return this.inventoryRepository.save(inventory)
  }

  async reserveStock(variantId: VariantDto['id'], quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0')
    }

    const inventory = await this.findbyVariantId(variantId)

    const availableStock = inventory.quantity - inventory.reserved

    if (availableStock < quantity) {
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'insufficientAvailableStock',
        },
      })
    }

    inventory.reserved += quantity

    return this.inventoryRepository.save(inventory)
  }

  async releaseReservedStock(variantId: VariantDto['id'], quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        errors: {
          status: 'invalidQuantity',
        },
      })
    }

    const inventory = await this.findbyVariantId(variantId)

    if (inventory.reserved < quantity) {
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'insufficientReservedStock',
        },
      })
    }

    inventory.reserved -= quantity

    return this.inventoryRepository.save(inventory)
  }

  async validateAvailableStock(variantId: VariantDto['id'], quantity: number) {
    const inventory = await this.findbyVariantId(variantId)
    if (!inventory) {
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        errors: {
          status: 'inventoryNotFound',
        },
      })
    }
    const availableStock = inventory.quantity - inventory.reserved
    if (availableStock < quantity) {
      throw new UnprocessableEntityException({
        HttpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'insufficientAvailableStock',
        },
      })
    }
    return availableStock >= quantity
  }

  async removeInventory(variantId: VariantDto['id']) {
    const inventory = await this.findbyVariantId(variantId)

    return this.inventoryRepository.remove(inventory.id)
  }
}

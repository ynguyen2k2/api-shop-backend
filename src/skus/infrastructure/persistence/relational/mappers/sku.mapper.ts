import { sku } from '~/skus/domain/sku';
import { skuEntity } from '../entities/sku.entity';

export class skuMapper {
  static toDomain(raw: skuEntity): sku {
    const domainEntity = new sku();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: sku): skuEntity {
    const persistenceEntity = new skuEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class Createtable1778464665684 implements MigrationInterface {
  name = 'Createtable1778464665684'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "deletedAt" TO "isActive"`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute" RENAME COLUMN "deletedAt" TO "isActive"`,
    )
    await queryRunner.query(
      `CREATE TABLE "image_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, "productId" uuid, CONSTRAINT "PK_e6a9e829e17fc47fc17d695af8e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "compareAtPrice" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "productId" uuid, CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "imageUrl"`)
    await queryRunner.query(
      `ALTER TABLE "product" ADD "shortDescription" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "specifications" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "slug" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "reviews" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "description" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "isFeatured" SET DEFAULT false`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "isNew" SET DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "averageRating" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "totalReviews" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "isActive" SET DEFAULT true`,
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`)
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" DROP COLUMN "isActive"`)
    await queryRunner.query(
      `ALTER TABLE "attribute" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "image_product" ADD CONSTRAINT "FK_46730a20b58d86123a5bedada8d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`,
    )
    await queryRunner.query(
      `ALTER TABLE "image_product" DROP CONSTRAINT "FK_46730a20b58d86123a5bedada8d"`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" DROP COLUMN "isActive"`)
    await queryRunner.query(`ALTER TABLE "attribute" ADD "isActive" TIMESTAMP`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`)
    await queryRunner.query(`ALTER TABLE "user" ADD "isActive" TIMESTAMP`)
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "isActive" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "totalReviews" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "averageRating" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "isNew" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "isFeatured" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "description" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" DROP COLUMN "isActive"`,
    )
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "reviews"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slug"`)
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "specifications"`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "shortDescription"`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "imageUrl" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "stock" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "price" integer NOT NULL`,
    )
    await queryRunner.query(`DROP TABLE "variant"`)
    await queryRunner.query(`DROP TABLE "image_product"`)
    await queryRunner.query(
      `ALTER TABLE "attribute" RENAME COLUMN "isActive" TO "deletedAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "isActive" TO "deletedAt"`,
    )
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateInitTable1779435284898 implements MigrationInterface {
  name = 'CreateInitTable1779435284898'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attribute-value" DROP CONSTRAINT "FK_839ae2c940400230b03a765a712"`,
    )
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "deletedAt" TO "isActive"`,
    )
    await queryRunner.query(
      `CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "reserved" integer NOT NULL, "warehouse" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "variant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sku" character varying NOT NULL, "price" integer NOT NULL, "compareAtPrice" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "productId" uuid, CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "image_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, "productId" uuid, CONSTRAINT "PK_e6a9e829e17fc47fc17d695af8e" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "userId" integer, "productId" uuid, CONSTRAINT "UQ_711cb665a4d4f8421265d921319" UNIQUE ("userId", "productId"), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "category_attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isVariant" boolean NOT NULL DEFAULT false, "isRequired" boolean NOT NULL DEFAULT false, "isFilterable" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "categoryId" integer, "attributeId" integer, CONSTRAINT "PK_f58b128e30a1ad029b32fb79624" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" DROP COLUMN "deletedAt"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "stock"`)
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "imageUrl"`)
    await queryRunner.query(
      `ALTER TABLE "attribute" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" ADD "isActive" boolean NOT NULL DEFAULT true`,
    )
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
      `ALTER TABLE "attribute" DROP CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729"`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "attribute" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "attribute" ADD CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" DROP COLUMN "attribute_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" ADD "attribute_id" integer`,
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
    await queryRunner.query(
      `ALTER TABLE "attribute-value" ADD CONSTRAINT "FK_839ae2c940400230b03a765a712" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "variant" ADD CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "image_product" ADD CONSTRAINT "FK_46730a20b58d86123a5bedada8d" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "category_attributes" ADD CONSTRAINT "FK_38209e8493459f8b98aa107be2b" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "category_attributes" ADD CONSTRAINT "FK_4eeba7ff3f73d77a0884341456e" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_attributes" DROP CONSTRAINT "FK_4eeba7ff3f73d77a0884341456e"`,
    )
    await queryRunner.query(
      `ALTER TABLE "category_attributes" DROP CONSTRAINT "FK_38209e8493459f8b98aa107be2b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_2a11d3c0ea1b2b5b1790f762b9a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`,
    )
    await queryRunner.query(
      `ALTER TABLE "image_product" DROP CONSTRAINT "FK_46730a20b58d86123a5bedada8d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "variant" DROP CONSTRAINT "FK_cb0df5c8d79ac0ea08a87119673"`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" DROP CONSTRAINT "FK_839ae2c940400230b03a765a712"`,
    )
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
      `ALTER TABLE "attribute-value" DROP COLUMN "attribute_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" ADD "attribute_id" uuid`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute" DROP CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729"`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "attribute" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute" ADD CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slug"`)
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "specifications"`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "shortDescription"`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" DROP COLUMN "isActive"`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" DROP COLUMN "isActive"`)
    await queryRunner.query(
      `ALTER TABLE "product" ADD "imageUrl" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "stock" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD "price" integer NOT NULL`,
    )
    await queryRunner.query(`ALTER TABLE "attribute" ADD "deletedAt" TIMESTAMP`)
    await queryRunner.query(`DROP TABLE "cart"`)
    await queryRunner.query(`DROP TABLE "category_attributes"`)
    await queryRunner.query(`DROP TABLE "review"`)
    await queryRunner.query(`DROP TABLE "image_product"`)
    await queryRunner.query(`DROP TABLE "variant"`)
    await queryRunner.query(`DROP TABLE "inventory"`)
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "isActive" TO "deletedAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "attribute-value" ADD CONSTRAINT "FK_839ae2c940400230b03a765a712" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}

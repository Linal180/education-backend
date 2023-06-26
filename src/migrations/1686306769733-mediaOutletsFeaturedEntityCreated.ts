import { MigrationInterface, QueryRunner } from "typeorm";

export class mediaOutletsFeaturedEntityCreated1686306769733 implements MigrationInterface {
  name = 'mediaOutletsFeaturedEntityCreated1686306769733'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "MediaOutletsFeatured" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_747ad49c88e6c058d64086ea3d7" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "MediaOutletsFeatured"`);
  }

}

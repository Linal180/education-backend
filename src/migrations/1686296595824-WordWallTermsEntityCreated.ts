import { MigrationInterface, QueryRunner } from "typeorm";

export class WordWallTermsEntityCreated1686296595824 implements MigrationInterface {
  name = 'WordWallTermsEntityCreated1686296595824'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "WordWallTerms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c8eae6f5c01a5458b201b7c3727" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "WordWallTerms"`);
  }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class WordWallTermLinksEntityCreated1686303900235 implements MigrationInterface {
  name = 'WordWallTermLinksEntityCreated1686303900235'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "WordWallTermLinks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e5a2ab5eb735e8f994a37b5fd61" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "WordWallTermLinks"`);
  }

}

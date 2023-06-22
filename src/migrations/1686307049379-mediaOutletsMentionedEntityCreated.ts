import { MigrationInterface, QueryRunner } from "typeorm";

export class mediaOutletsMentionedEntityCreated1686307049379 implements MigrationInterface {
  name = 'mediaOutletsMentionedEntityCreated1686307049379'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "MediaOutletsMentioned" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_945d0ecdbae9538c8d5a66e6296" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "MediaOutletsMentioned"`);
  }

}

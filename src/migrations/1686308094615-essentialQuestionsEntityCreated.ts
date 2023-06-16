import { MigrationInterface, QueryRunner } from "typeorm";

export class essentialQuestionsEntityCreated1686308094615 implements MigrationInterface {
  name = 'essentialQuestionsEntityCreated1686308094615'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "EssentialQuestions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ed2b8239751dcdf0f09ac64ee01" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "EssentialQuestions"`);
  }

}

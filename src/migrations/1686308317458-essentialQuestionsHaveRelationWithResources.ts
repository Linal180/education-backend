import { MigrationInterface, QueryRunner } from "typeorm";

export class essentialQuestionsHaveRelationWithResources1686308317458 implements MigrationInterface {
  name = 'essentialQuestionsHaveRelationWithResources1686308317458'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ResourcesEssentialQuestions" ("essentialQuestionsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_88223b6da21591450034b94f480" PRIMARY KEY ("essentialQuestionsId", "resourcesId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_a9c4fad0221f1ecafd73aa7723" ON "ResourcesEssentialQuestions" ("essentialQuestionsId") `);
    await queryRunner.query(`CREATE INDEX "IDX_4999206651ded53bfa66e6f9ad" ON "ResourcesEssentialQuestions" ("resourcesId") `);
    await queryRunner.query(`ALTER TABLE "ResourcesEssentialQuestions" ADD CONSTRAINT "FK_a9c4fad0221f1ecafd73aa77233" FOREIGN KEY ("essentialQuestionsId") REFERENCES "EssentialQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "ResourcesEssentialQuestions" ADD CONSTRAINT "FK_4999206651ded53bfa66e6f9ad9" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ResourcesEssentialQuestions" DROP CONSTRAINT "FK_4999206651ded53bfa66e6f9ad9"`);
    await queryRunner.query(`ALTER TABLE "ResourcesEssentialQuestions" DROP CONSTRAINT "FK_a9c4fad0221f1ecafd73aa77233"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4999206651ded53bfa66e6f9ad"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a9c4fad0221f1ecafd73aa7723"`);
    await queryRunner.query(`DROP TABLE "ResourcesEssentialQuestions"`);
  }

}

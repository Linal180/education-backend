import { MigrationInterface, QueryRunner } from "typeorm";

export class WordWallTermsHaveRelationWithResource1686297531238 implements MigrationInterface {
  name = 'WordWallTermsHaveRelationWithResource1686297531238'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ResourcesWordWallTerms" ("wordWallTermsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_8c256d78481a787937520dc9a45" PRIMARY KEY ("wordWallTermsId", "resourcesId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_bef986eb1cd43ae93be72cb03b" ON "ResourcesWordWallTerms" ("wordWallTermsId") `);
    await queryRunner.query(`CREATE INDEX "IDX_bad5660d862357a4fc23ba0614" ON "ResourcesWordWallTerms" ("resourcesId") `);
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTerms" ADD CONSTRAINT "FK_bef986eb1cd43ae93be72cb03b2" FOREIGN KEY ("wordWallTermsId") REFERENCES "WordWallTerms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTerms" ADD CONSTRAINT "FK_bad5660d862357a4fc23ba06143" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTerms" DROP CONSTRAINT "FK_bad5660d862357a4fc23ba06143"`);
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTerms" DROP CONSTRAINT "FK_bef986eb1cd43ae93be72cb03b2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bad5660d862357a4fc23ba0614"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bef986eb1cd43ae93be72cb03b"`);
    await queryRunner.query(`DROP TABLE "ResourcesWordWallTerms"`);
  }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class WordWallTermLinksHaveRelationWithResources1686304413780 implements MigrationInterface {
  name = 'WordWallTermLinksHaveRelationWithResources1686304413780'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ResourcesWordWallTermLinks" ("wordWallTermLinksId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_86d5520621e4ffc4f464e669f29" PRIMARY KEY ("wordWallTermLinksId", "resourcesId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_0ba0f222d1c4aab76b488b523c" ON "ResourcesWordWallTermLinks" ("wordWallTermLinksId") `);
    await queryRunner.query(`CREATE INDEX "IDX_19987c16ec5ff5db7e5ff4d727" ON "ResourcesWordWallTermLinks" ("resourcesId") `);
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTermLinks" ADD CONSTRAINT "FK_0ba0f222d1c4aab76b488b523c9" FOREIGN KEY ("wordWallTermLinksId") REFERENCES "WordWallTermLinks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTermLinks" ADD CONSTRAINT "FK_19987c16ec5ff5db7e5ff4d7273" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTermLinks" DROP CONSTRAINT "FK_19987c16ec5ff5db7e5ff4d7273"`);
    await queryRunner.query(`ALTER TABLE "ResourcesWordWallTermLinks" DROP CONSTRAINT "FK_0ba0f222d1c4aab76b488b523c9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_19987c16ec5ff5db7e5ff4d727"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0ba0f222d1c4aab76b488b523c"`);
    await queryRunner.query(`DROP TABLE "ResourcesWordWallTermLinks"`);
  }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class mediaOutletsMentionedHaveRelationWithResources1686307274163 implements MigrationInterface {
  name = 'mediaOutletsMentionedHaveRelationWithResources1686307274163'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ResourcesMediaOutletsMentiond" ("mediaOutletsMentionedId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_9221fbddde04bdcb20d921190d6" PRIMARY KEY ("mediaOutletsMentionedId", "resourcesId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_2b4721de5a873c9c0b01f50923" ON "ResourcesMediaOutletsMentiond" ("mediaOutletsMentionedId") `);
    await queryRunner.query(`CREATE INDEX "IDX_0fdb8713a847b43897ff3d8d4a" ON "ResourcesMediaOutletsMentiond" ("resourcesId") `);
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsMentiond" ADD CONSTRAINT "FK_2b4721de5a873c9c0b01f509231" FOREIGN KEY ("mediaOutletsMentionedId") REFERENCES "MediaOutletsMentioned"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsMentiond" ADD CONSTRAINT "FK_0fdb8713a847b43897ff3d8d4a2" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsMentiond" DROP CONSTRAINT "FK_0fdb8713a847b43897ff3d8d4a2"`);
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsMentiond" DROP CONSTRAINT "FK_2b4721de5a873c9c0b01f509231"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0fdb8713a847b43897ff3d8d4a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2b4721de5a873c9c0b01f50923"`);
    await queryRunner.query(`DROP TABLE "ResourcesMediaOutletsMentiond"`);
  }

}

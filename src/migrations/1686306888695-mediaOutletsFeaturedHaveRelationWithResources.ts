import { MigrationInterface, QueryRunner } from "typeorm";

export class mediaOutletsFeaturedHaveRelationWithResources1686306888695 implements MigrationInterface {
  name = 'mediaOutletsFeaturedHaveRelationWithResources1686306888695'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ResourcesMediaOutletsFeatured" ("mediaOutletsFeaturedId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_0366a39bb8f2087043c987326d1" PRIMARY KEY ("mediaOutletsFeaturedId", "resourcesId"))`);
    await queryRunner.query(`CREATE INDEX "IDX_99ed192411d24b5c0d1d52b3f0" ON "ResourcesMediaOutletsFeatured" ("mediaOutletsFeaturedId") `);
    await queryRunner.query(`CREATE INDEX "IDX_4199f47909b46bbf78e77ee1f3" ON "ResourcesMediaOutletsFeatured" ("resourcesId") `);
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsFeatured" ADD CONSTRAINT "FK_99ed192411d24b5c0d1d52b3f02" FOREIGN KEY ("mediaOutletsFeaturedId") REFERENCES "MediaOutletsFeatured"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsFeatured" ADD CONSTRAINT "FK_4199f47909b46bbf78e77ee1f35" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsFeatured" DROP CONSTRAINT "FK_4199f47909b46bbf78e77ee1f35"`);
    await queryRunner.query(`ALTER TABLE "ResourcesMediaOutletsFeatured" DROP CONSTRAINT "FK_99ed192411d24b5c0d1d52b3f02"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4199f47909b46bbf78e77ee1f3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_99ed192411d24b5c0d1d52b3f0"`);
    await queryRunner.query(`DROP TABLE "ResourcesMediaOutletsFeatured"`);
  }

}

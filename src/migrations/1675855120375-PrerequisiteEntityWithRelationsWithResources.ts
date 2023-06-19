import { MigrationInterface, QueryRunner } from "typeorm";

export class PrerequisiteEntityWithRelationsWithResources1675855120375 implements MigrationInterface {
    name = 'PrerequisiteEntityWithRelationsWithResources1675855120375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Prerequisites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bca09fbf542b89127e32c126346" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesPrerequisites" ("prerequisitesId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_310851f9b351b0c6336370905e4" PRIMARY KEY ("prerequisitesId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_332a49963a02f44e10fb9909dd" ON "ResourcesPrerequisites" ("prerequisitesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_caee4661c5da847a6bacdab825" ON "ResourcesPrerequisites" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "assessmentTypes"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "prerequisites"`);
        await queryRunner.query(`ALTER TABLE "ResourcesPrerequisites" ADD CONSTRAINT "FK_332a49963a02f44e10fb9909dd5" FOREIGN KEY ("prerequisitesId") REFERENCES "Prerequisites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesPrerequisites" ADD CONSTRAINT "FK_caee4661c5da847a6bacdab825f" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesPrerequisites" DROP CONSTRAINT "FK_caee4661c5da847a6bacdab825f"`);
        await queryRunner.query(`ALTER TABLE "ResourcesPrerequisites" DROP CONSTRAINT "FK_332a49963a02f44e10fb9909dd5"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "prerequisites" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "assessmentTypes" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_caee4661c5da847a6bacdab825"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_332a49963a02f44e10fb9909dd"`);
        await queryRunner.query(`DROP TABLE "ResourcesPrerequisites"`);
        await queryRunner.query(`DROP TABLE "Prerequisites"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class NlpStandardsEntityWithRelationsWithResources1675854038451 implements MigrationInterface {
    name = 'NlpStandardsEntityWithRelationsWithResources1675854038451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "NlpStandards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_33d540df76d323a4d4d9d742219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SubjectAreas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_64c276345ffb2dd2ab451cbc047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesNlpStandards" ("nlpStandardsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_ca2d9fcaf3340cb36040a8af0e2" PRIMARY KEY ("nlpStandardsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f425338cf26dffdffa9219f5c" ON "ResourcesNlpStandards" ("nlpStandardsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c40050e6a42c1c5f5e94f4aa41" ON "ResourcesNlpStandards" ("resourcesId") `);
        await queryRunner.query(`CREATE TABLE "ResourcesSubjectAreas" ("subjectAreasId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_8d3c755b67f98ffa1b492b43c00" PRIMARY KEY ("subjectAreasId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_19ce50d094f132bd29e3f046a5" ON "ResourcesSubjectAreas" ("subjectAreasId") `);
        await queryRunner.query(`CREATE INDEX "IDX_46763bf77a4bafd8ec065ba27f" ON "ResourcesSubjectAreas" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "nlpStandards"`);
        await queryRunner.query(`ALTER TABLE "ResourcesNlpStandards" ADD CONSTRAINT "FK_6f425338cf26dffdffa9219f5c9" FOREIGN KEY ("nlpStandardsId") REFERENCES "NlpStandards"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesNlpStandards" ADD CONSTRAINT "FK_c40050e6a42c1c5f5e94f4aa414" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesSubjectAreas" ADD CONSTRAINT "FK_19ce50d094f132bd29e3f046a50" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesSubjectAreas" ADD CONSTRAINT "FK_46763bf77a4bafd8ec065ba27f5" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesSubjectAreas" DROP CONSTRAINT "FK_46763bf77a4bafd8ec065ba27f5"`);
        await queryRunner.query(`ALTER TABLE "ResourcesSubjectAreas" DROP CONSTRAINT "FK_19ce50d094f132bd29e3f046a50"`);
        await queryRunner.query(`ALTER TABLE "ResourcesNlpStandards" DROP CONSTRAINT "FK_c40050e6a42c1c5f5e94f4aa414"`);
        await queryRunner.query(`ALTER TABLE "ResourcesNlpStandards" DROP CONSTRAINT "FK_6f425338cf26dffdffa9219f5c9"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "nlpStandards" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46763bf77a4bafd8ec065ba27f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19ce50d094f132bd29e3f046a5"`);
        await queryRunner.query(`DROP TABLE "ResourcesSubjectAreas"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c40050e6a42c1c5f5e94f4aa41"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f425338cf26dffdffa9219f5c"`);
        await queryRunner.query(`DROP TABLE "ResourcesNlpStandards"`);
        await queryRunner.query(`DROP TABLE "SubjectAreas"`);
        await queryRunner.query(`DROP TABLE "NlpStandards"`);
    }

}

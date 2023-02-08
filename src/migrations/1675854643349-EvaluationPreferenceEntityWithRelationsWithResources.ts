import { MigrationInterface, QueryRunner } from "typeorm";

export class EvaluationPreferenceEntityWithRelationsWithResources1675854643349 implements MigrationInterface {
    name = 'EvaluationPreferenceEntityWithRelationsWithResources1675854643349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ContentWarnings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e3ac03b04a89853eea717599ee7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EvaluationPreferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7209d4b27e8d857c4152012b13f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesContentWarnings" ("contentWarningsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_cb99db789926bc2b2d79f5ee0b0" PRIMARY KEY ("contentWarningsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d310d750c5888f92ccab24a62c" ON "ResourcesContentWarnings" ("contentWarningsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_be5537b5c833dd086ec64fc848" ON "ResourcesContentWarnings" ("resourcesId") `);
        await queryRunner.query(`CREATE TABLE "ResourcesEvaluationPreferences" ("evaluationPreferencesId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_2472b02a5fc27aa2c85d321c33c" PRIMARY KEY ("evaluationPreferencesId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eb6c491abbc8738ec8a8832051" ON "ResourcesEvaluationPreferences" ("evaluationPreferencesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b94440162d3c194d31c6114800" ON "ResourcesEvaluationPreferences" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "journalistOrSME"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "linkToContent"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "resourcesType"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "subjectAreas"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "newsLiteracyTopics"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "contentWarnings"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "evaluationPreference"`);
        await queryRunner.query(`ALTER TABLE "ResourcesContentWarnings" ADD CONSTRAINT "FK_d310d750c5888f92ccab24a62c0" FOREIGN KEY ("contentWarningsId") REFERENCES "ContentWarnings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesContentWarnings" ADD CONSTRAINT "FK_be5537b5c833dd086ec64fc8481" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesEvaluationPreferences" ADD CONSTRAINT "FK_eb6c491abbc8738ec8a8832051a" FOREIGN KEY ("evaluationPreferencesId") REFERENCES "EvaluationPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesEvaluationPreferences" ADD CONSTRAINT "FK_b94440162d3c194d31c61148009" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesEvaluationPreferences" DROP CONSTRAINT "FK_b94440162d3c194d31c61148009"`);
        await queryRunner.query(`ALTER TABLE "ResourcesEvaluationPreferences" DROP CONSTRAINT "FK_eb6c491abbc8738ec8a8832051a"`);
        await queryRunner.query(`ALTER TABLE "ResourcesContentWarnings" DROP CONSTRAINT "FK_be5537b5c833dd086ec64fc8481"`);
        await queryRunner.query(`ALTER TABLE "ResourcesContentWarnings" DROP CONSTRAINT "FK_d310d750c5888f92ccab24a62c0"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "evaluationPreference" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "contentWarnings" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "newsLiteracyTopics" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "subjectAreas" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "resourcesType" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "linkToContent" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "journalistOrSME" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b94440162d3c194d31c6114800"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb6c491abbc8738ec8a8832051"`);
        await queryRunner.query(`DROP TABLE "ResourcesEvaluationPreferences"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be5537b5c833dd086ec64fc848"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d310d750c5888f92ccab24a62c"`);
        await queryRunner.query(`DROP TABLE "ResourcesContentWarnings"`);
        await queryRunner.query(`DROP TABLE "EvaluationPreferences"`);
        await queryRunner.query(`DROP TABLE "ContentWarnings"`);
    }

}

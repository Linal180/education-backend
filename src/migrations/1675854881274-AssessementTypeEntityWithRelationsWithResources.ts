import { MigrationInterface, QueryRunner } from "typeorm";

export class AssessementTypeEntityWithRelationsWithResources1675854881274 implements MigrationInterface {
    name = 'AssessementTypeEntityWithRelationsWithResources1675854881274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "AssessmentTypes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2717f0261b76c33a1637cd10cbf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesAssessmentTypes" ("assessmentTypesId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_1d18c0d38b735fe533ea9c61a0b" PRIMARY KEY ("assessmentTypesId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f38ae2b2b02f25134e7269f1d2" ON "ResourcesAssessmentTypes" ("assessmentTypesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_52362bc4ce2a621775587b8d2d" ON "ResourcesAssessmentTypes" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "ResourcesAssessmentTypes" ADD CONSTRAINT "FK_f38ae2b2b02f25134e7269f1d29" FOREIGN KEY ("assessmentTypesId") REFERENCES "AssessmentTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesAssessmentTypes" ADD CONSTRAINT "FK_52362bc4ce2a621775587b8d2d8" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesAssessmentTypes" DROP CONSTRAINT "FK_52362bc4ce2a621775587b8d2d8"`);
        await queryRunner.query(`ALTER TABLE "ResourcesAssessmentTypes" DROP CONSTRAINT "FK_f38ae2b2b02f25134e7269f1d29"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_52362bc4ce2a621775587b8d2d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f38ae2b2b02f25134e7269f1d2"`);
        await queryRunner.query(`DROP TABLE "ResourcesAssessmentTypes"`);
        await queryRunner.query(`DROP TABLE "AssessmentTypes"`);
    }

}

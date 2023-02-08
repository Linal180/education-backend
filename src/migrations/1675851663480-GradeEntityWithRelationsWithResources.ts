import { MigrationInterface, QueryRunner } from "typeorm";

export class GradeEntityWithRelationsWithResources1675851663480 implements MigrationInterface {
    name = 'GradeEntityWithRelationsWithResources1675851663480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3687b0df14b7f4f7150078eaaa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesGrades" ("gradesId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_02ae9be3c0d06a9224a23dfbbb4" PRIMARY KEY ("gradesId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_196f0adc173e4ffe4ab1182bf9" ON "ResourcesGrades" ("gradesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_03a19d704406f4e08bd5a2451f" ON "ResourcesGrades" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "gradeLevel"`);
        await queryRunner.query(`ALTER TABLE "ResourcesGrades" ADD CONSTRAINT "FK_196f0adc173e4ffe4ab1182bf90" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesGrades" ADD CONSTRAINT "FK_03a19d704406f4e08bd5a2451fb" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesGrades" DROP CONSTRAINT "FK_03a19d704406f4e08bd5a2451fb"`);
        await queryRunner.query(`ALTER TABLE "ResourcesGrades" DROP CONSTRAINT "FK_196f0adc173e4ffe4ab1182bf90"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "gradeLevel" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03a19d704406f4e08bd5a2451f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_196f0adc173e4ffe4ab1182bf9"`);
        await queryRunner.query(`DROP TABLE "ResourcesGrades"`);
        await queryRunner.query(`DROP TABLE "Grades"`);
    }

}

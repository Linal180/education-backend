import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecordIdInResourcesAssociate1684843409137 implements MigrationInterface {
    name = 'AddRecordIdInResourcesAssociate1684843409137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AssessmentTypes" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "ClassRoomNeeds" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "ContentLinks" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "ContentWarnings" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "EvaluationPreferences" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "Formats" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "Journalists" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "NewsLiteracyTopics" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "NLNOTopNavigations" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "NlpStandards" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "Prerequisites" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "ResourceTypes" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "SubjectAreas" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "Grades" ADD "recordId" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_c76fe30896223b0344c030a4cfa" UNIQUE ("awsSub")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_c76fe30896223b0344c030a4cfa"`);
        await queryRunner.query(`ALTER TABLE "Grades" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "SubjectAreas" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "ResourceTypes" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "Prerequisites" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "NlpStandards" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "NLNOTopNavigations" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "NewsLiteracyTopics" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "Journalists" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "Formats" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "EvaluationPreferences" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "ContentWarnings" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "ContentLinks" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "ClassRoomNeeds" DROP COLUMN "recordId"`);
        await queryRunner.query(`ALTER TABLE "AssessmentTypes" DROP COLUMN "recordId"`);
    }

}

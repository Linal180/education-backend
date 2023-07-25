import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConstraintOfDatesInResources1689923720239 implements MigrationInterface {
    name = 'UpdateConstraintOfDatesInResources1689923720239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ADD "createdTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "lastReviewDate"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "lastReviewDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "lastModifyDate"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "lastModifyDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "lastModifyDate"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "lastModifyDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "lastReviewDate"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "lastReviewDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "createdTime"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ResourcesHaveNewColumns1686294569564 implements MigrationInterface {
  name = 'ResourcesHaveNewColumns1686294569564'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Journalists" ADD "organization" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "checkologyPoints" integer`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "averageCompletedTime" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "shouldGoToDormant" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "status" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "imageGroup" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "imageStatus" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "auditStatus" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "auditLink" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "userFeedBack" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "linkToTranscript" character varying`);
    await queryRunner.query(`ALTER TABLE "Resources" ADD "lastModifyDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "lastModifyDate"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "linkToTranscript"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "userFeedBack"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "auditLink"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "auditStatus"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "imageStatus"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "imageGroup"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "shouldGoToDormant"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "averageCompletedTime"`);
    await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "checkologyPoints"`);
    await queryRunner.query(`ALTER TABLE "Journalists" DROP COLUMN "organization"`);
  }

}

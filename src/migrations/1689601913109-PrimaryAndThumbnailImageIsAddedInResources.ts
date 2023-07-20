import { MigrationInterface, QueryRunner } from "typeorm";

export class PrimaryAndThumbnailImageIsAddedInResources1689601913109 implements MigrationInterface {
    name = 'PrimaryAndThumbnailImageIsAddedInResources1689601913109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ADD "primaryImage" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "thumbnailImage" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "thumbnailImage"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "primaryImage"`);
    }

}

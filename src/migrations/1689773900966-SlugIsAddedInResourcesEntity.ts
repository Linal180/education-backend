import { MigrationInterface, QueryRunner } from "typeorm";

export class SlugIsAddedInResourcesEntity1689773900966 implements MigrationInterface {
    name = 'SlugIsAddedInResourcesEntity1689773900966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ADD "slug" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "slug"`);
    }

}

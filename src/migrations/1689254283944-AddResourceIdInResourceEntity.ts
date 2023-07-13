import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResourceIdInResourceEntity1689254283944 implements MigrationInterface {
    name = 'AddResourceIdInResourceEntity1689254283944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ADD "resourceId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "resourceId"`);
    }

}

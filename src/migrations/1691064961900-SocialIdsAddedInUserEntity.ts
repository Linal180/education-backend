import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialIdsAddedInUserEntity1691064961900 implements MigrationInterface {
    name = 'SocialIdsAddedInUserEntity1691064961900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "microsoftId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "microsoftId"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "googleId"`);
    }

}

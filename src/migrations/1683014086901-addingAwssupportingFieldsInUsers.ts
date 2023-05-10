import { MigrationInterface, QueryRunner } from "typeorm";

export class addingAwssupportingFieldsInUsers1683014086901 implements MigrationInterface {
    name = 'addingAwssupportingFieldsInUsers1683014086901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "awsAccessToken" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "awsRefreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "awsSub" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "awsSub"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "awsRefreshToken"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "awsAccessToken"`);
    }

}

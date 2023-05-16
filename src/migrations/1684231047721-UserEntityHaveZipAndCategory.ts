import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityHaveZipAndCategory1684231047721 implements MigrationInterface {
    name = 'UserEntityHaveZipAndCategory1684231047721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "category" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "zip" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "zip"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "category"`); 
    }

}

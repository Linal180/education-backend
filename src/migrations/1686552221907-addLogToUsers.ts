import { MigrationInterface, QueryRunner } from "typeorm";

export class addLogToUsers1686552221907 implements MigrationInterface {
    name = 'addLogToUsers1686552221907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "log" text DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "log"`);
    }

}

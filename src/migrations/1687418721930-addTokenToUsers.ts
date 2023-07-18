import { MigrationInterface, QueryRunner } from "typeorm";

export class addTokenToUsers1687418721930 implements MigrationInterface {
    name = 'addTokenToUsers1687418721930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "token"`);
    }

}

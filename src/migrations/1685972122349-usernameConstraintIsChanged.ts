import { MigrationInterface, QueryRunner } from "typeorm";

export class usernameConstraintIsChanged1685972122349 implements MigrationInterface {
    name = 'usernameConstraintIsChanged1685972122349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "username"`);
    }

}

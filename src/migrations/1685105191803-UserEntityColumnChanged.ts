import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEntityColumnChanged1685105191803 implements MigrationInterface {
    name = 'UserEntityColumnChanged1685105191803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "newsLitNationAcess"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "nlnOpt" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "siftOpt" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "numOfLogins" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "lastLoginAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "lastLoginAt"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "numOfLogins"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "siftOpt"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "nlnOpt"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "newsLitNationAcess" boolean DEFAULT false`);
    }

}

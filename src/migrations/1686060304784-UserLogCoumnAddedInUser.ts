import { MigrationInterface, QueryRunner } from "typeorm";

export class UserLogCoumnAddedInUser1686060304784 implements MigrationInterface {
    name = 'UserLogCoumnAddedInUser1686060304784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "log" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ALTER COLUMN "log" DROP DEFAULT`);
    }

}

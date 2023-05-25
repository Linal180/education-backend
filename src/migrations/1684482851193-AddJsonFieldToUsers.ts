import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJsonFieldToUsers1684482851193 implements MigrationInterface {
    name = 'AddJsonFieldToUsers1684482851193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "meta" json`);
     }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "meta"`);
     }

}

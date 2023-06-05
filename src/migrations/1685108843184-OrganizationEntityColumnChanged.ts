import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationEntityColumnChanged1685108843184 implements MigrationInterface {
    name = 'OrganizationEntityColumnChanged1685108843184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "street" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "state"`);
    }

}

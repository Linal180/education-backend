import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationMigrationAdded1683024372574 implements MigrationInterface {
    name = 'OrganizationMigrationAdded1683024372574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "zipCode"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "NAME" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "ZIP" character varying`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "CITY" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "CITY"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "ZIP"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "NAME"`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "name" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "zipCode" character varying`);
    }

}

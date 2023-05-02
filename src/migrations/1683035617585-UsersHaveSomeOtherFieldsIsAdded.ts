import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersHaveSomeOtherFieldsIsAdded1683035617585 implements MigrationInterface {
    name = 'UsersHaveSomeOtherFieldsIsAdded1683035617585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "newsLitNationAcess" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum" RENAME TO "Roles_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum" AS ENUM('educators', 'Student', 'Independent-learner', 'super-admin', 'admin')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum_old" RENAME TO "Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "newsLitNationAcess"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "country"`);
    }

}
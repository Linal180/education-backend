import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationMigrationAdded1683035617586 implements MigrationInterface {
    name = 'OrganizationMigrationAdded1683035617586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum" USING "role"::"text"::"public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum_old" AS ENUM('super-admin', 'admin', 'attorney', 'paralegal', 'investigator')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum_old" USING "role"::"text"::"public"."Roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
    }
}

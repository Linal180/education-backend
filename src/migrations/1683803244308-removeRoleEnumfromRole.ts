import { MigrationInterface, QueryRunner } from "typeorm";

export class removeRoleEnumfromRole1683803244308 implements MigrationInterface {
    name = 'removeRoleEnumfromRole1683803244308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "role" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum" AS ENUM('educators', 'Student', 'Independent-learner', 'super-admin', 'admin', 'student')`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "role" "public"."Roles_role_enum" NOT NULL DEFAULT 'admin'`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class resourceEntityChanges1681894157915 implements MigrationInterface {
    name = 'resourceEntityChanges1681894157915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ADD "linkToDescription" character varying`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "onlyOnCheckology" boolean`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "featuredInSift" boolean`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "lastReviewDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum" RENAME TO "Roles_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum" AS ENUM('super-admin', 'newsLitNation-member', 'educator-registrant', 'Visitor', 'Educator', 'independent-learner', 'Student')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum" USING "role"::"text"::"public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'super-admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum_old" AS ENUM('super-admin', 'admin', 'attorney', 'paralegal', 'investigator')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum_old" USING "role"::"text"::"public"."Roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum_old" RENAME TO "Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "lastReviewDate"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "featuredInSift"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "onlyOnCheckology"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "linkToDescription"`);
    }

}

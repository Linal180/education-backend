import { MigrationInterface, QueryRunner } from "typeorm";

export class HomeSchoolRemoved1684215274247 implements MigrationInterface {
    name = 'HomeSchoolRemoved1684215274247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum" RENAME TO "Organization_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current', 'School_Characteristics_Current')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum" USING "category"::"text"::"public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum_old" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current', 'School_Characteristics_Current', 'Home_School')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum_old" USING "category"::"text"::"public"."Organization_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum_old" RENAME TO "Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "url" character varying`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "state" character varying`);
    }

}

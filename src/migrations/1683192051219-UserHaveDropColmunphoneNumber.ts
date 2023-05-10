import { MigrationInterface, QueryRunner } from "typeorm";

export class UserHaveDropColmunphoneNumber1683192051219 implements MigrationInterface {
    name = 'UserHaveDropColmunphoneNumber1683192051219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum" RENAME TO "Organization_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum" USING "category"::"text"::"public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum_old" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum_old" USING "category"::"text"::"public"."Organization_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum_old" RENAME TO "Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "phoneNumber" character varying`);
    }

}

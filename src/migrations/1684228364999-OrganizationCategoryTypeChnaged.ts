import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationCategoryTypeChnaged1684228364999 implements MigrationInterface {
    name = 'OrganizationCategoryTypeChnaged1684228364999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "category" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "category"`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current', 'School_Characteristics_Current')`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "category" "public"."Organization_category_enum" NOT NULL DEFAULT 'Private_School_Locations_Current'`);
    }

}

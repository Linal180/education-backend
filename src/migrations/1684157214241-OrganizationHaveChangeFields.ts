import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationHaveChangeFields1684157214241 implements MigrationInterface {
    name = 'OrganizationHaveChangeFields1684157214241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "url" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum" RENAME TO "Organization_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current', 'School_Characteristics_Current', 'Home_School')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum" USING "category"::"text"::"public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_991ba77a930228d047b0442f233"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_7b6e678964b7634eb56a35d4526" PRIMARY KEY ("gradesId")`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_7b6e678964b7634eb56a35d4526"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_991ba77a930228d047b0442f233"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_7b6e678964b7634eb56a35d4526" PRIMARY KEY ("gradesId")`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_7b6e678964b7634eb56a35d4526"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId")`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum_old" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current', 'School_Characteristics_Current')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum_old" USING "category"::"text"::"public"."Organization_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum_old" RENAME TO "Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "state"`);
    }

}

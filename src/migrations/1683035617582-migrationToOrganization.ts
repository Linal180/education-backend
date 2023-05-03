import { MigrationInterface, QueryRunner } from "typeorm";

export class migrationToOrganization1683035617582 implements MigrationInterface {
    name = 'migrationToOrganization1683035617582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819')`);
        await queryRunner.query(`CREATE TABLE "Organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "NAME" character varying NOT NULL DEFAULT '', "category" "public"."Organization_category_enum" NOT NULL DEFAULT 'Private_School_Locations_Current', "ZIP" character varying, "CITY" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_67bcafc78935cd441a054c6d4ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Organization"`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum"`);
    }


}
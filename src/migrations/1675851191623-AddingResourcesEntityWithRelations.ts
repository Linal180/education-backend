import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingResourcesEntityWithRelations1675851191623 implements MigrationInterface {
    name = 'AddingResourcesEntityWithRelations1675851191623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "NLNOTopNavigations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_da4f9e2af158b9e67d2e199ab79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourceTypes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d5937e1b12ddb9690df74d40a5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Resources" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contentTitle" character varying, "contentDescription" character varying, "journalistOrSME" character varying, "linkToContent" character varying, "resourcesType" character varying, "gradeLevel" character varying, "classroomNeeds" character varying, "subjectAreas" character varying, "nlpStandards" character varying, "newsLiteracyTopics" character varying, "contentWarnings" character varying, "estimatedTimeToComplete" character varying, "evaluationPreference" character varying, "assessmentTypes" character varying, "prerequisites" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cb2d1b1fe8da812b2406657ccfa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Formats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_37f8fd5b2266c86a565e162db65" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesnlnoTopNavigations" ("nLNOTopNavigationsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_adc8bb067c8293878ff9424e18c" PRIMARY KEY ("nLNOTopNavigationsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c374c89226e44ea1124796fea9" ON "ResourcesnlnoTopNavigations" ("nLNOTopNavigationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a04b473c10acc9982a262eb79a" ON "ResourcesnlnoTopNavigations" ("resourcesId") `);
        await queryRunner.query(`CREATE TABLE "ResourcesTypes" ("resourceTypesId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_9e09bd7bf94f2c6add5cad8df31" PRIMARY KEY ("resourceTypesId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78db5fab91a1baaabe61eb2b31" ON "ResourcesTypes" ("resourceTypesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_835288a8600331e870d647244d" ON "ResourcesTypes" ("resourcesId") `);
        await queryRunner.query(`CREATE TABLE "ResourcesFormats" ("formatsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_c7a9815d415defc7e3eedb11228" PRIMARY KEY ("formatsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a63dba43bf7ede598723ad12f0" ON "ResourcesFormats" ("formatsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd22ae021a8fb8d41d0420700d" ON "ResourcesFormats" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "paymentVerified"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum" RENAME TO "Roles_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum" AS ENUM('super-admin', 'admin', 'attorney', 'paralegal', 'investigator')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum" USING "role"::"text"::"public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ResourcesnlnoTopNavigations" ADD CONSTRAINT "FK_c374c89226e44ea1124796fea95" FOREIGN KEY ("nLNOTopNavigationsId") REFERENCES "NLNOTopNavigations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesnlnoTopNavigations" ADD CONSTRAINT "FK_a04b473c10acc9982a262eb79a9" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesTypes" ADD CONSTRAINT "FK_78db5fab91a1baaabe61eb2b316" FOREIGN KEY ("resourceTypesId") REFERENCES "ResourceTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesTypes" ADD CONSTRAINT "FK_835288a8600331e870d647244d9" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesFormats" ADD CONSTRAINT "FK_a63dba43bf7ede598723ad12f0b" FOREIGN KEY ("formatsId") REFERENCES "Formats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesFormats" ADD CONSTRAINT "FK_cd22ae021a8fb8d41d0420700d2" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesFormats" DROP CONSTRAINT "FK_cd22ae021a8fb8d41d0420700d2"`);
        await queryRunner.query(`ALTER TABLE "ResourcesFormats" DROP CONSTRAINT "FK_a63dba43bf7ede598723ad12f0b"`);
        await queryRunner.query(`ALTER TABLE "ResourcesTypes" DROP CONSTRAINT "FK_835288a8600331e870d647244d9"`);
        await queryRunner.query(`ALTER TABLE "ResourcesTypes" DROP CONSTRAINT "FK_78db5fab91a1baaabe61eb2b316"`);
        await queryRunner.query(`ALTER TABLE "ResourcesnlnoTopNavigations" DROP CONSTRAINT "FK_a04b473c10acc9982a262eb79a9"`);
        await queryRunner.query(`ALTER TABLE "ResourcesnlnoTopNavigations" DROP CONSTRAINT "FK_c374c89226e44ea1124796fea95"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum_old" AS ENUM('super-admin', 'admin', 'attorney', 'paralegal')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum_old" USING "role"::"text"::"public"."Roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum_old" RENAME TO "Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "paymentVerified" boolean DEFAULT false`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd22ae021a8fb8d41d0420700d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a63dba43bf7ede598723ad12f0"`);
        await queryRunner.query(`DROP TABLE "ResourcesFormats"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_835288a8600331e870d647244d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78db5fab91a1baaabe61eb2b31"`);
        await queryRunner.query(`DROP TABLE "ResourcesTypes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a04b473c10acc9982a262eb79a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c374c89226e44ea1124796fea9"`);
        await queryRunner.query(`DROP TABLE "ResourcesnlnoTopNavigations"`);
        await queryRunner.query(`DROP TABLE "Formats"`);
        await queryRunner.query(`DROP TABLE "Resources"`);
        await queryRunner.query(`DROP TABLE "ResourceTypes"`);
        await queryRunner.query(`DROP TABLE "NLNOTopNavigations"`);
    }

}

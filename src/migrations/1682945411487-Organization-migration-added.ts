import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationMigrationAdded1682945411487 implements MigrationInterface {
    name = 'OrganizationMigrationAdded1682945411487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL DEFAULT '', "category" character varying, "zipCode" character varying, "city" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_67bcafc78935cd441a054c6d4ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UsersSubjectAreas" ("subjectAreasId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_ef20b0bddbe6235207e0c3ef60f" PRIMARY KEY ("subjectAreasId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74a04e5714f61a67c6f5757545" ON "UsersSubjectAreas" ("subjectAreasId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ad29d186b2e1fe8726891ea42" ON "UsersSubjectAreas" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "UserGrades" ("gradesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7b6e678964b7634eb56a35d452" ON "UserGrades" ("gradesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd6be8ef1a6eaeaa73b1232f6d" ON "UserGrades" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "Users" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "newsLitNationAcess" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum" RENAME TO "Roles_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum" AS ENUM('educators', 'Student', 'Independent-learner', 'super-admin', 'admin')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum" USING "role"::"text"::"public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD CONSTRAINT "FK_58856335ca12537a0c480cd7b8a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424"`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP CONSTRAINT "FK_58856335ca12537a0c480cd7b8a"`);
        await queryRunner.query(`CREATE TYPE "public"."Roles_role_enum_old" AS ENUM('super-admin', 'admin', 'attorney', 'paralegal', 'investigator')`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" TYPE "public"."Roles_role_enum_old" USING "role"::"text"::"public"."Roles_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Roles" ALTER COLUMN "role" SET DEFAULT 'admin'`);
        await queryRunner.query(`DROP TYPE "public"."Roles_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Roles_role_enum_old" RENAME TO "Roles_role_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "newsLitNationAcess"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "country"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd6be8ef1a6eaeaa73b1232f6d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b6e678964b7634eb56a35d452"`);
        await queryRunner.query(`DROP TABLE "UserGrades"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ad29d186b2e1fe8726891ea42"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74a04e5714f61a67c6f5757545"`);
        await queryRunner.query(`DROP TABLE "UsersSubjectAreas"`);
        await queryRunner.query(`DROP TABLE "Organization"`);
    }

}

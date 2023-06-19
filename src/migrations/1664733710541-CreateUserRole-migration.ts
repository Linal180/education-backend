import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1664733710541 implements MigrationInterface {
  name = "migration1664733710541";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."Users_status_enum" AS ENUM('0', '1')`
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "status" "public"."Users_status_enum" NOT NULL DEFAULT '0', "emailVerified" boolean DEFAULT false, "paymentVerified" boolean DEFAULT false, "password" character varying NOT NULL, "email" character varying NOT NULL, "stripeCustomerId" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Roles_role_enum" AS ENUM('super-admin', 'admin', 'attorney', 'paralegal')`
    );
    await queryRunner.query(
      `CREATE TABLE "Roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."Roles_role_enum" NOT NULL DEFAULT 'admin', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "UserRoles" ("usersId" uuid NOT NULL, "rolesId" uuid NOT NULL, CONSTRAINT "PK_41f29aa90a36836859f102ad6c7" PRIMARY KEY ("usersId", "rolesId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_80547a481dff59f01c1cc7ef3a" ON "UserRoles" ("usersId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98cefa4e99eff3fd0c9116431c" ON "UserRoles" ("rolesId") `
    );
    await queryRunner.query(
      `ALTER TABLE "UserRoles" ADD CONSTRAINT "FK_80547a481dff59f01c1cc7ef3a2" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "UserRoles" ADD CONSTRAINT "FK_98cefa4e99eff3fd0c9116431ca" FOREIGN KEY ("rolesId") REFERENCES "Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserRoles" DROP CONSTRAINT "FK_98cefa4e99eff3fd0c9116431ca"`
    );
    await queryRunner.query(
      `ALTER TABLE "UserRoles" DROP CONSTRAINT "FK_80547a481dff59f01c1cc7ef3a2"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_98cefa4e99eff3fd0c9116431c"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_80547a481dff59f01c1cc7ef3a"`
    );
    await queryRunner.query(`DROP TABLE "UserRoles"`);
    await queryRunner.query(`DROP TABLE "Roles"`);
    await queryRunner.query(`DROP TYPE "public"."Roles_role_enum"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TYPE "public"."Users_status_enum"`);
  }
}

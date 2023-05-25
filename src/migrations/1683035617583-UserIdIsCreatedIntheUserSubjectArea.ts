import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdIsCreatedIntheUserSubjectArea1683035617583 implements MigrationInterface {
    name = 'UserIdIsCreatedIntheUserSubjectArea1683035617583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UsersSubjectAreas" ("subjectAreasId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_ef20b0bddbe6235207e0c3ef60f" PRIMARY KEY ("subjectAreasId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74a04e5714f61a67c6f5757545" ON "UsersSubjectAreas" ("subjectAreasId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ad29d186b2e1fe8726891ea42" ON "UsersSubjectAreas" ("usersId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6ad29d186b2e1fe8726891ea42"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74a04e5714f61a67c6f5757545"`);
        await queryRunner.query(`DROP TABLE "UsersSubjectAreas"`);
    }
}
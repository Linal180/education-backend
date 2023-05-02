import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdisaddedIntheUserGrades1683035617584 implements MigrationInterface {
    name = 'UserIdisaddedIntheUserGrades1683035617584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserGrades" ("gradesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7b6e678964b7634eb56a35d452" ON "UserGrades" ("gradesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd6be8ef1a6eaeaa73b1232f6d" ON "UserGrades" ("usersId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fd6be8ef1a6eaeaa73b1232f6d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7b6e678964b7634eb56a35d452"`);
        await queryRunner.query(`DROP TABLE "UserGrades"`); 
    }
}
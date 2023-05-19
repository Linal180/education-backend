import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJsonFieldToUsers1684482851193 implements MigrationInterface {
    name = 'AddJsonFieldToUsers1684482851193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_7b6e678964b7634eb56a35d452"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_fd6be8ef1a6eaeaa73b1232f6d"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_74a04e5714f61a67c6f5757545"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_6ad29d186b2e1fe8726891ea42"`);
        // await queryRunner.query(`ALTER TABLE "Users" ADD "category" character varying`);
        // await queryRunner.query(`ALTER TABLE "Users" ADD "zip" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "meta" json`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_991ba77a930228d047b0442f233"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_7b6e678964b7634eb56a35d4526" PRIMARY KEY ("gradesId")`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId")`);
        // await queryRunner.query(`CREATE INDEX "IDX_74a04e5714f61a67c6f5757545" ON "UsersSubjectAreas" ("subjectAreasId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_6ad29d186b2e1fe8726891ea42" ON "UsersSubjectAreas" ("usersId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_7b6e678964b7634eb56a35d452" ON "UserGrades" ("gradesId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_fd6be8ef1a6eaeaa73b1232f6d" ON "UserGrades" ("usersId") `);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_fd6be8ef1a6eaeaa73b1232f6d"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_7b6e678964b7634eb56a35d452"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_6ad29d186b2e1fe8726891ea42"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_74a04e5714f61a67c6f5757545"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_991ba77a930228d047b0442f233"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_7b6e678964b7634eb56a35d4526" PRIMARY KEY ("gradesId")`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId")`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "meta"`);
        // await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "zip"`);
        // await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "category"`);
        // await queryRunner.query(`CREATE INDEX "IDX_6ad29d186b2e1fe8726891ea42" ON "UsersSubjectAreas" ("usersId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_74a04e5714f61a67c6f5757545" ON "UsersSubjectAreas" ("subjectAreasId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_fd6be8ef1a6eaeaa73b1232f6d" ON "UserGrades" ("usersId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_7b6e678964b7634eb56a35d452" ON "UserGrades" ("gradesId") `);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

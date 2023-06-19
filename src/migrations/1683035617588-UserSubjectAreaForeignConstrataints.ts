import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSubjectAreaForeignConstrataints1683035617588 implements MigrationInterface {
    name = 'UserSubjectAreaForeignConstrataints1683035617588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424"`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
    }
}
import { MigrationInterface, QueryRunner } from "typeorm";

export class UserGradesForeignConstraints1683035617589 implements MigrationInterface {
    name = 'UserGradesForeignConstraints1683035617589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
    }

}
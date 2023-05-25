import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationRelationShipChanged1684935409595 implements MigrationInterface {
    name = 'OrganizationRelationShipChanged1684935409595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP CONSTRAINT "FK_58856335ca12537a0c480cd7b8a"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        await queryRunner.query(`ALTER TABLE "Organization" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "organizationId" uuid`);
        const constraintExistsQuery = `
            SELECT constraint_name
            FROM information_schema.constraint_column_usage
            WHERE table_name = 'Users'
                AND constraint_name = 'UQ_c76fe30896223b0344c030a4cfa'
        `;
        const constraintExistsResult = await queryRunner.query(constraintExistsQuery);

        if (constraintExistsResult.length === 0) {
            await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "UQ_c76fe30896223b0344c030a4cfa" UNIQUE ("awsSub")`);
        }

        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_1612823a86e1cc991e52bd8b664" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_1612823a86e1cc991e52bd8b664"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "UQ_c76fe30896223b0344c030a4cfa"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Organization" ADD CONSTRAINT "FK_58856335ca12537a0c480cd7b8a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeContentDescriptionToConstraintText1689852641524 implements MigrationInterface {
    name = 'ChangeContentDescriptionToConstraintText1689852641524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "contentDescription"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "contentDescription" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "contentDescription"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "contentDescription" character varying`);
    }

}

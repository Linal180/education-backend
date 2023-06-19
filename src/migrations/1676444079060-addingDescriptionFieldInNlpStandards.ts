import { MigrationInterface, QueryRunner } from "typeorm";

export class addingDescriptionFieldInNlpStandards1676444079060 implements MigrationInterface {
    name = 'addingDescriptionFieldInNlpStandards1676444079060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "NlpStandards" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "NlpStandards" DROP COLUMN "description"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class addedOnUpdateandDeleteforContentLinks1676447591105 implements MigrationInterface {
    name = 'addedOnUpdateandDeleteforContentLinks1676447591105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ContentLinks" DROP CONSTRAINT "FK_40a341c406b236fa9d48e4da0cd"`);
        await queryRunner.query(`ALTER TABLE "ContentLinks" ADD CONSTRAINT "FK_40a341c406b236fa9d48e4da0cd" FOREIGN KEY ("resourceId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ContentLinks" DROP CONSTRAINT "FK_40a341c406b236fa9d48e4da0cd"`);
        await queryRunner.query(`ALTER TABLE "ContentLinks" ADD CONSTRAINT "FK_40a341c406b236fa9d48e4da0cd" FOREIGN KEY ("resourceId") REFERENCES "Resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

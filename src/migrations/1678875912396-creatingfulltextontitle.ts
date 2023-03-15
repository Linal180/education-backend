import { MigrationInterface, QueryRunner } from "typeorm";

export class creatingfulltextontitle1678875912396 implements MigrationInterface {
    name = 'creatingfulltextontitle1678875912396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bef10a334c681684644b6711b5"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "contentTitle_tsvector"`);
        await queryRunner.query(`CREATE INDEX "IDX_c8858359f57b1b409f21b3a91b" ON "Resources" ("contentTitle") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c8858359f57b1b409f21b3a91b"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "contentTitle_tsvector" tsvector`);
        await queryRunner.query(`CREATE INDEX "IDX_bef10a334c681684644b6711b5" ON "Resources" ("contentTitle_tsvector") `);
    }

}

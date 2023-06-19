import { MigrationInterface, QueryRunner } from "typeorm";

export class addedFullTextSearchIndexOnContentTitle1676377121497 implements MigrationInterface {
    name = 'addedFullTextSearchIndexOnContentTitle1676377121497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ADD "contentTitle_tsvector" tsvector`);
        await queryRunner.query(`CREATE INDEX "IDX_bef10a334c681684644b6711b5" ON "Resources" ("contentTitle_tsvector") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bef10a334c681684644b6711b5"`);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "contentTitle_tsvector"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class NewsLiteracyTopicsEntityWithRelationsWithResources1675854247833 implements MigrationInterface {
    name = 'NewsLiteracyTopicsEntityWithRelationsWithResources1675854247833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "NewsLiteracyTopics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c2d08e071e040a02be2002d2002" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesNewsLiteracyTopics" ("newsLiteracyTopicsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_5ae52bc9b3e87e4d3f0542dd80f" PRIMARY KEY ("newsLiteracyTopicsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f0f9e06fc2a754d95932efd9a9" ON "ResourcesNewsLiteracyTopics" ("newsLiteracyTopicsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a4d1ff9df870e2129462331dd5" ON "ResourcesNewsLiteracyTopics" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "ResourcesNewsLiteracyTopics" ADD CONSTRAINT "FK_f0f9e06fc2a754d95932efd9a93" FOREIGN KEY ("newsLiteracyTopicsId") REFERENCES "NewsLiteracyTopics"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesNewsLiteracyTopics" ADD CONSTRAINT "FK_a4d1ff9df870e2129462331dd55" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesNewsLiteracyTopics" DROP CONSTRAINT "FK_a4d1ff9df870e2129462331dd55"`);
        await queryRunner.query(`ALTER TABLE "ResourcesNewsLiteracyTopics" DROP CONSTRAINT "FK_f0f9e06fc2a754d95932efd9a93"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4d1ff9df870e2129462331dd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0f9e06fc2a754d95932efd9a9"`);
        await queryRunner.query(`DROP TABLE "ResourcesNewsLiteracyTopics"`);
        await queryRunner.query(`DROP TABLE "NewsLiteracyTopics"`);
    }

}

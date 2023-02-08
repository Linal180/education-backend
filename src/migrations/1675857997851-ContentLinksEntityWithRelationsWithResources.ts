import { MigrationInterface, QueryRunner } from "typeorm";

export class ContentLinksEntityWithRelationsWithResources1675857997851 implements MigrationInterface {
    name = 'ContentLinksEntityWithRelationsWithResources1675857997851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ContentLinks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "url" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "resourceId" uuid, CONSTRAINT "PK_d15d3d361f15b542f89a06327e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ContentLinks" ADD CONSTRAINT "FK_40a341c406b236fa9d48e4da0cd" FOREIGN KEY ("resourceId") REFERENCES "Resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ContentLinks" DROP CONSTRAINT "FK_40a341c406b236fa9d48e4da0cd"`);
        await queryRunner.query(`DROP TABLE "ContentLinks"`);
    }

}

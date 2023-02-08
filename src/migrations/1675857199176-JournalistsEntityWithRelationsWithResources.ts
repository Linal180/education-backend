import { MigrationInterface, QueryRunner } from "typeorm";

export class JournalistsEntityWithRelationsWithResources1675857199176 implements MigrationInterface {
    name = 'JournalistsEntityWithRelationsWithResources1675857199176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Journalists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3ec2ffbde92e37219f4df778553" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesJournalists" ("journalistsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_4c72a3105125b4e8c22073c3825" PRIMARY KEY ("journalistsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b976f88e6fad1ef8c329ad331" ON "ResourcesJournalists" ("journalistsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6022445c2d18a4bf77bb7fa9ba" ON "ResourcesJournalists" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "ResourcesJournalists" ADD CONSTRAINT "FK_3b976f88e6fad1ef8c329ad3318" FOREIGN KEY ("journalistsId") REFERENCES "Journalists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesJournalists" ADD CONSTRAINT "FK_6022445c2d18a4bf77bb7fa9ba0" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesJournalists" DROP CONSTRAINT "FK_6022445c2d18a4bf77bb7fa9ba0"`);
        await queryRunner.query(`ALTER TABLE "ResourcesJournalists" DROP CONSTRAINT "FK_3b976f88e6fad1ef8c329ad3318"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6022445c2d18a4bf77bb7fa9ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b976f88e6fad1ef8c329ad331"`);
        await queryRunner.query(`DROP TABLE "ResourcesJournalists"`);
        await queryRunner.query(`DROP TABLE "Journalists"`);
    }

}

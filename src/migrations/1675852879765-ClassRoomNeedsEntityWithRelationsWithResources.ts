import { MigrationInterface, QueryRunner } from "typeorm";

export class ClassRoomNeedsEntityWithRelationsWithResources1675852879765 implements MigrationInterface {
    name = 'ClassRoomNeedsEntityWithRelationsWithResources1675852879765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ClassRoomNeeds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_77aaf868cd08aa05da3da2587b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ResourcesClassRoomNeeds" ("classRoomNeedsId" uuid NOT NULL, "resourcesId" uuid NOT NULL, CONSTRAINT "PK_6fb2e1b32d2a677c74d4d8012e5" PRIMARY KEY ("classRoomNeedsId", "resourcesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e2f9550be2edfa2113462d4083" ON "ResourcesClassRoomNeeds" ("classRoomNeedsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b405822537a5184d3dc2e525b8" ON "ResourcesClassRoomNeeds" ("resourcesId") `);
        await queryRunner.query(`ALTER TABLE "Resources" DROP COLUMN "classroomNeeds"`);
        await queryRunner.query(`ALTER TABLE "ResourcesClassRoomNeeds" ADD CONSTRAINT "FK_e2f9550be2edfa2113462d40836" FOREIGN KEY ("classRoomNeedsId") REFERENCES "ClassRoomNeeds"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "ResourcesClassRoomNeeds" ADD CONSTRAINT "FK_b405822537a5184d3dc2e525b83" FOREIGN KEY ("resourcesId") REFERENCES "Resources"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ResourcesClassRoomNeeds" DROP CONSTRAINT "FK_b405822537a5184d3dc2e525b83"`);
        await queryRunner.query(`ALTER TABLE "ResourcesClassRoomNeeds" DROP CONSTRAINT "FK_e2f9550be2edfa2113462d40836"`);
        await queryRunner.query(`ALTER TABLE "Resources" ADD "classroomNeeds" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b405822537a5184d3dc2e525b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2f9550be2edfa2113462d4083"`);
        await queryRunner.query(`DROP TABLE "ResourcesClassRoomNeeds"`);
        await queryRunner.query(`DROP TABLE "ClassRoomNeeds"`);
    }

}

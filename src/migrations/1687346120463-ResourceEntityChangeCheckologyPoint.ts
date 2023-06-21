import { MigrationInterface, QueryRunner } from "typeorm";

export class ResourceEntityChangeCheckologyPoint1687346120463 implements MigrationInterface {
    name = 'ResourceEntityChangeCheckologyPoint1687346120463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ALTER COLUMN "checkologyPoints" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Resources" ALTER COLUMN "checkologyPoints" DROP DEFAULT`);
    }

}

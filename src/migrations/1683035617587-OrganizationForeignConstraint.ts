import { MigrationInterface, QueryRunner } from "typeorm";

export class OrganizationForeignConstraint1683035617587 implements MigrationInterface {
    name = 'OrganizationForeignConstraint1683035617587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" ADD CONSTRAINT "FK_58856335ca12537a0c480cd7b8a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Organization" DROP CONSTRAINT "FK_58856335ca12537a0c480cd7b8a"`);
    }
}
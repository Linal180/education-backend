import { MigrationInterface, QueryRunner } from "typeorm";

export class UserColumnCountryIsChanged1683611812518 implements MigrationInterface {
    name = 'UserColumnCountryIsChanged1683611812518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_7b6e678964b7634eb56a35d452"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_fd6be8ef1a6eaeaa73b1232f6d"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_74a04e5714f61a67c6f5757545"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_6ad29d186b2e1fe8726891ea42"`);

        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum" RENAME TO "Organization_category_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current', 'School_Characteristics_Current')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum" USING "category"::"text"::"public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "country"`);
        await queryRunner.query(`CREATE TYPE "public"."Users_country_enum" AS ENUM('AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KR', 'KP', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW')`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "country" "public"."Users_country_enum" NOT NULL DEFAULT 'US'`);

        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_991ba77a930228d047b0442f233"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_7b6e678964b7634eb56a35d4526" PRIMARY KEY ("gradesId")`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId")`);
        // await queryRunner.query(`CREATE INDEX "IDX_74a04e5714f61a67c6f5757545" ON "UsersSubjectAreas" ("subjectAreasId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_6ad29d186b2e1fe8726891ea42" ON "UsersSubjectAreas" ("usersId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_7b6e678964b7634eb56a35d452" ON "UserGrades" ("gradesId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_fd6be8ef1a6eaeaa73b1232f6d" ON "UserGrades" ("usersId") `);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "FK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424"`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" DROP CONSTRAINT "FK_74a04e5714f61a67c6f57575451"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_fd6be8ef1a6eaeaa73b1232f6d"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_7b6e678964b7634eb56a35d452"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_6ad29d186b2e1fe8726891ea42"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_74a04e5714f61a67c6f5757545"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_991ba77a930228d047b0442f233"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_7b6e678964b7634eb56a35d4526" PRIMARY KEY ("gradesId")`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" DROP CONSTRAINT "PK_7b6e678964b7634eb56a35d4526"`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "PK_991ba77a930228d047b0442f233" PRIMARY KEY ("gradesId", "usersId")`);
        
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "country"`);
        await queryRunner.query(`DROP TYPE "public"."Users_country_enum"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "country" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."Organization_category_enum_old" AS ENUM('Private_School_Locations_Current', 'Public_School_Location_201819', 'Postsecondary_School_Locations_Current')`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" TYPE "public"."Organization_category_enum_old" USING "category"::"text"::"public"."Organization_category_enum_old"`);
        await queryRunner.query(`ALTER TABLE "Organization" ALTER COLUMN "category" SET DEFAULT 'Private_School_Locations_Current'`);
        await queryRunner.query(`DROP TYPE "public"."Organization_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Organization_category_enum_old" RENAME TO "Organization_category_enum"`);
        
        // await queryRunner.query(`CREATE INDEX "IDX_6ad29d186b2e1fe8726891ea42" ON "UsersSubjectAreas" ("usersId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_74a04e5714f61a67c6f5757545" ON "UsersSubjectAreas" ("subjectAreasId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_fd6be8ef1a6eaeaa73b1232f6d" ON "UserGrades" ("usersId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_7b6e678964b7634eb56a35d452" ON "UserGrades" ("gradesId") `);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_6ad29d186b2e1fe8726891ea424" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UsersSubjectAreas" ADD CONSTRAINT "FK_74a04e5714f61a67c6f57575451" FOREIGN KEY ("subjectAreasId") REFERENCES "SubjectAreas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_fd6be8ef1a6eaeaa73b1232f6d0" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "UserGrades" ADD CONSTRAINT "FK_7b6e678964b7634eb56a35d4526" FOREIGN KEY ("gradesId") REFERENCES "Grades"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}

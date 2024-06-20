import { MigrationInterface, QueryRunner } from "typeorm";

export class codingCompilerExt1718840485826 implements MigrationInterface {
    name = 'codingCompilerExt1718840485826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`test_case_result\` (\`id\` varchar(36) NOT NULL, \`input\` text NOT NULL, \`expectedOutput\` text NOT NULL, \`actualOutput\` text NOT NULL, \`success\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`codingSolutionId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`test_case_result\``);
    }

}

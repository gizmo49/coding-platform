import {MigrationInterface, QueryRunner} from "typeorm";

export class codingCompiler1718835736681 implements MigrationInterface {
    name = 'codingCompiler1718835736681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`test_case_result\` (\`id\` varchar(36) NOT NULL, \`input\` text NOT NULL, \`expectedOutput\` text NOT NULL, \`actualOutput\` text NOT NULL, \`success\` tinyint NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`codingSolutionId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // await queryRunner.query(`ALTER TABLE \`test_case_result\` ADD CONSTRAINT \`FK_c99564f7761ad543cc05d89b472\` FOREIGN KEY (\`codingSolutionId\`) REFERENCES \`coding_solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`test_case_result\` DROP FOREIGN KEY \`FK_c99564f7761ad543cc05d89b472\``);
        await queryRunner.query(`DROP TABLE \`test_case_result\``);
    }

}

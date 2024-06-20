import {MigrationInterface, QueryRunner} from "typeorm";

export class codingProblem1718781066631 implements MigrationInterface {
    name = 'codingProblem1718781066631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`coding_solution\` (\`id\` varchar(36) NOT NULL, \`codingSolutionId\` varchar(255) NOT NULL, \`language\` varchar(255) NOT NULL, \`code\` varchar(255) NULL, \`passedTestCases\` int NULL, \`problemId\` varchar(36) NULL, \`solvedById\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`coding_problem_test_case\` (\`id\` varchar(36) NOT NULL, \`input\` varchar(255) NOT NULL, \`expectedOutput\` varchar(255) NOT NULL, \`problemId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`coding_problem\` (\`id\` varchar(36) NOT NULL, \`codingProblemId\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`constraints\` text NOT NULL , \`followUp\` text NULL , \`hints\` varchar(255) NULL, \`createdById\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`coding_problem_example\` (\`id\` varchar(36) NOT NULL, \`input\` varchar(255) NOT NULL, \`output\` varchar(255) NOT NULL, \`explanation\` varchar(255) NOT NULL, \`codingProblemId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`userImage\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`coding_solution\` ADD CONSTRAINT \`FK_35cf5f2d4a1e1730d43e254d737\` FOREIGN KEY (\`problemId\`) REFERENCES \`coding_problem\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`coding_solution\` ADD CONSTRAINT \`FK_5669674cf3e7eef108c05adb909\` FOREIGN KEY (\`solvedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`coding_problem_test_case\` ADD CONSTRAINT \`FK_1229e10b1114a0bb6b8a4fdcbc6\` FOREIGN KEY (\`problemId\`) REFERENCES \`coding_problem\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`coding_problem\` ADD CONSTRAINT \`FK_d00a8f60dd23a47b2e217eae160\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`coding_problem_example\` ADD CONSTRAINT \`FK_3c5b8eca45875973992044b6fc2\` FOREIGN KEY (\`codingProblemId\`) REFERENCES \`coding_problem\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`coding_problem_example\` DROP FOREIGN KEY \`FK_3c5b8eca45875973992044b6fc2\``);
        await queryRunner.query(`ALTER TABLE \`coding_problem\` DROP FOREIGN KEY \`FK_d00a8f60dd23a47b2e217eae160\``);
        await queryRunner.query(`ALTER TABLE \`coding_problem_test_case\` DROP FOREIGN KEY \`FK_1229e10b1114a0bb6b8a4fdcbc6\``);
        await queryRunner.query(`ALTER TABLE \`coding_solution\` DROP FOREIGN KEY \`FK_5669674cf3e7eef108c05adb909\``);
        await queryRunner.query(`ALTER TABLE \`coding_solution\` DROP FOREIGN KEY \`FK_35cf5f2d4a1e1730d43e254d737\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userImage\``);
        await queryRunner.query(`DROP TABLE \`coding_problem_example\``);
        await queryRunner.query(`DROP TABLE \`coding_problem\``);
        await queryRunner.query(`DROP TABLE \`coding_problem_test_case\``);
        await queryRunner.query(`DROP TABLE \`coding_solution\``);
    }

}

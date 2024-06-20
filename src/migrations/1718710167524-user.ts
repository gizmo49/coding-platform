import {MigrationInterface, QueryRunner} from "typeorm";

export class user1718710167524 implements MigrationInterface {
    name = 'user1718710167524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`userType\` enum ('ADMIN', 'DEFAULT') NOT NULL DEFAULT 'DEFAULT', \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`salt\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}

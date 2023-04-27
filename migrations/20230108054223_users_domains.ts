import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users_domains', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned().notNullable();
        table.integer('domain_id').unsigned().notNullable();
        table.integer('role_id').nullable();
        table.timestamps(true, true);
        table.foreign('user_id');
        table.foreign('domain_id');
        table.foreign('role_id');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users_domains');
}


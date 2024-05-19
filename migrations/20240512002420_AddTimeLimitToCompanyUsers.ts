import { type Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('company_users', (table) => {
        table.string('time_limit', 255).defaultTo('8h');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('company_users', (table) => {
        table.dropColumn('time_limit');
    })
}


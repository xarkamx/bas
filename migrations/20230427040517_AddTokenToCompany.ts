import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('companies', (table) => {
    table.string('token');
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('companies', (table) => {
    table.dropColumn('token');
  })
}


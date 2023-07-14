import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('devices', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('token').notNullable();
    table.string('type').notNullable();
    table.string('os').notNullable();
    table.string('os_version').notNullable();
    table.string('browser').notNullable();
    table.string('brand').notNullable();
    table.integer('company_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('devices');
}


import type { Knex } from 'knex';

exports.up =  async function (knex: Knex): Promise<void> {
  return knex.schema.createTable('users_roles', (table) => {
    table.increments('id');
    table.integer('user_id').notNullable();
    table.integer('role_id').notNullable();
    table.timestamps(true, true);
  });
};

exports.down =  async function (knex: Knex): Promise<void> {
  return knex.schema.dropTable('users_roles');
};

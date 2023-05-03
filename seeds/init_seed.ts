import {type Knex } from "knex";
import { passwordEncrypt } from '../src/utils/passwordUtils';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();
    await knex("companies").del();
    await knex("company_users").del();
    await knex("roles").del();
    await knex("users_roles").del();
    await knex("domains").del();
    await knex("company_domains").del();
    await knex("users_domains").del();


    // Inserts seed entries
    await knex("users").insert([
        { name: "admin", email: "admin@demo.com", password: passwordEncrypt("qwerty12") }
    ]);

    await knex("companies").insert([
        { name: "admin", address_id: 1 }
    ]);

    await knex("company_users").insert({
        user_id: 1,
        company_id: 1
    });

    await knex("roles").insert([
        { name: "master", company_id: 1 },
    ]);

    await knex("users_roles").insert([
        { user_id: 1, role_id: 1 }
    ]);
}

;

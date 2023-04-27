import {type Knex } from "knex";
import { passwordEncrypt } from '../src/utils/passwordUtils';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("bas.users").del();

    // Inserts seed entries
    await knex("bas.users").insert([
        { name: "admin", email: "admin@demo.com", password: passwordEncrypt("qwerty12") }
    ]);

    await knex("bas.companies").insert([
        { name: "admin", address_id: 1 }
    ]);

    await knex("bas.company_users").insert({
        user_id: 1,
        company_id: 1
    });

    await knex("bas.roles").insert([
        { name: "master", company_id: 1 },
    ]);

    await knex("bas.users_roles").insert([
        { user_id: 1, role_id: 1 }
    ]);

    await knex("bas.domains").insert({
        domain: "demo.com"
    });

    await knex("bas.company_domains").insert({
        company_id: 1,
        domain_id: 1
    });

    await knex("bas.users_domains").insert({
        user_id: 1,
        domain_id: 1
    });
}

;

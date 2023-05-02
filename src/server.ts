// Require library to exit fastify process, gracefully (if possible)
import jwt from "@fastify/jwt";
import closeWithGrace from "close-with-grace";
import * as dotenv from "dotenv";
// Require the framework
import Fastify from "fastify";

import Db from "./db";
import { RolesServices } from './services/roles/rolesServices';
import { CompanyAuth } from './services/companies/companyAuth';
import { UsersService } from './services/users/users.service';
import { CompanyService } from './services/companies/companyService';

// Read the .env file.
dotenv.config();
Db.getInstance();

const isProduction = process.env.NODE_ENV === "production";
// Instantiate Fastify with some config
const app = Fastify({
  logger: !isProduction,
});

// Register JWT
void app.register<{ secret: any }>(jwt, {
  secret: process.env.JWT_SECRET,
});
// Register your application as a normal plugin.
void app.register(import("."));

// Init graphql

// Init Swagger

// Delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async (opts: any) => {
  if (opts.err) {
    app.log.error(opts.err);
  }

  await app.close();
});

app.addHook("onClose", async (_instance, done) => {
  closeListeners.uninstall();
  done();
});

app.addHook("onRequest", async (request: any, reply) => {
  const {config} = request.context;
  try {
    if (config.public) {
      return;
    }

    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

app.addHook("preValidation", async (request: any, reply) => {
  const {auth} = request.context.config;
  const companyAuth = new CompanyAuth();
  const companyServices = new CompanyService();
  const roleService = new RolesServices();
  if(!auth) return;
  if(auth.powerUser) {
    await companyAuth.isMasterUser(request.user.id);
    request.user.company = {id:1};
    return;
  }

  if(auth.companyOnly) {
    const {id} = request.params;
    const company = await companyServices.getCompany({token:id});
    await companyAuth.validUser(request.user.id,company.id,auth.roles);
    request.user.company = company;
  }

  if(auth.roles) {
    let roles = await roleService.getAllAvailableRolesForUser(request.user.id);
    roles = roles.map((role:any) => role.role);
    
    const hasRoles = auth.roles.some((role:string) => roles.includes(role));
    if(!hasRoles) {
      reply.send({message: 'Unauthorized',statusCode: 401});
    }
  }
});

// Start listening.
void app.listen({
  port: Number(process.env.PORT ?? 3000),
  host: process.env.SERVER_HOSTNAME ?? "127.0.0.1",
});

app.ready((err: Error) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`Server listening on port ${Number(process.env.PORT ?? 3000)}`);
});

export { app };

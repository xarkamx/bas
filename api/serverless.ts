import jwt from "@fastify/jwt";
import * as dotenv from "dotenv";
// Require the framework
import Fastify from "fastify";

import Db from "../src/db";
import { FastifyService } from '../src/FastifyService';

// Read the .env file.
dotenv.config();
Db.getInstance();

const isProduction = process.env.NODE_ENV === "production";
// Instantiate Fastify with some config
const app = Fastify({
  logger: !isProduction,
});

// Register JWT
void app.register<{ secret: any,sign:any,verify:any }>(jwt, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: "1h",
    iss: 'bas',
  },
  verify: {
    allowedIss:['bas']
  },
});
// Register your application as a normal plugin.
void app.register(import("../src/index"));

FastifyService(app)


export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit("request", req, res);
};

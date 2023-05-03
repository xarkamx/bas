import type { FastifyPluginAsync } from 'fastify';
import { UsersService } from '../../services/users/users.service';
import { CompanyService } from '../../services/companies/companyService';
import { HttpError } from '../../errors/HttpError';


const user: FastifyPluginAsync = async (fastify:any, _opts): Promise<void> => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' }
        },
      },
    },
    async handler (request:any, reply:any)  {
      const {username,email,password}:basicUser = request.body;
      const userService = new UsersService();
      const userExist = await userService.getUser({email});

      if(userExist) {
        throw new HttpError('User already exist',409);
      }

      const basicUser = userService.addUser({name:username,email, password})
      
      const resp = await basicUser;
      return {message:'User created',status:201,data:resp};
    }});

  fastify.route({
    method: 'POST',
    url: '/signup',
    config: { public: true },
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password','company'],
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          company: { type: 'string' }
        }
      }
    },
    async handler (request:any, reply:any)  {
      const {username,email,password,company}:any = request.body;
      const userService = new UsersService();
      const companyService = new CompanyService();
      const userExist = await userService.getUser({email,name:username});
      if(!userExist) {
        reply.code(404);
        return {message:'User not found'};
      }

      const companyExist = await companyService.getCompany({token:company});
      const companyUserExist = await companyService.getCompanyUserByEmail(companyExist.id,userExist.email);
      if(!companyUserExist[0]) {
         throw new HttpError('User not valid',401);
      }

      const valid =await userService.singUp({name:username,email, password});
      
      if(!valid) {
        throw new HttpError('User not valid',403);
      }

      const token = fastify.jwt.sign({email:userExist.email,id:userExist.id}, {expiresIn: '1h'});
      
      reply.code(200).send({token,ttl:new Date().getTime() + 3600000});
    }});
};



type basicUser = {
  username: string;
  email: string;
  password: string;
};
export default user;

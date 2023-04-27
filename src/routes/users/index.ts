import type { FastifyPluginAsync } from 'fastify';
import { UsersService } from '../../services/users/users.service';
import { CompanyService } from '../../services/companies/companyService';
import { HttpError } from '../../errors/HttpError';
import { CompanyAuth } from '../../services/companies/companyAuth';


const user: FastifyPluginAsync = async (fastify:any, _opts): Promise<void> => {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          company: { type: 'string' },
        },
      },
    },
    async handler (request:any, reply:any)  {
      const {user} = request;
      const {username,email,password}:basicUser = request.body;
      const userService = new UsersService();
      const companyService = new CompanyService();
      const userExist = await userService.getUser({email});

      if(userExist) {
        reply.code(409);
        return {message:'User already exist'};
      }

      const company = await companyService.getCompany({token:request.body.company});

      if(!company) {
        throw new HttpError('Company not found',404);
      }

      const companyId = company.id;

      const companyAuth = new CompanyAuth();
      console.log(user.id,companyId)
      await companyAuth.validUser(user.id,companyId,['master','admin']);

      const [userId] = await userService.addUser({name:username,email, password});
      await companyService.addUserToCompany(companyId,userId);
      return {message:'User created',status:201};
    }});

    fastify.route({
      method: 'POST',
      url: '/signup',
      schema: {
        public: true,
      },
      async handler (request:any, reply:any)  {
        const {username,email,password}:any = request.body;
        const userService = new UsersService();
        const userExist = await userService.getUser({email,name:username});
        if(!userExist) {
          reply.code(404);
          return {message:'User not found'};
        }

        const valid =await userService.singUp({name:username,email, password});
        
        if(!valid) {
          reply.code(401);
          return {message:'Invalid credentials'};
        }

        const token = fastify.jwt.sign({email:userExist.email,id:userExist.id}, {expiresIn: '1h'});
        
        reply.code(200).send({token,ttl:3600});
      }});
};



type basicUser = {
  username: string;
  email: string;
  password: string;
};
export default user;

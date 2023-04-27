import { type FastifyInstance } from 'fastify';
import { CompanyService } from '../../../../../services/companies/companyService';
import { RolesServices } from '../../../../../services/roles/RolesServices';
import { UsersService } from '../../../../../services/users/users.service';
import { HttpError } from '../../../../../errors/HttpError';

export default async function (fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/',
    async handler(request:any, reply)  {
      try{
        const {id,userId} = request.params;
      const companyService = new CompanyService();
      const user = await companyService.getCompanyUserById(id,userId);
      return user;
      }catch(err:any){
        reply.code(err.code || 500).send({message:err.message});
      }
      
    }
  },
  );
  fastify.route({
    method: 'POST',
    url: '/roles',
    async handler(request:any, reply)  {
      const {id,userId} = request.params;
      const {roleName} = request.body;
      try{
        const {userService,role} = await validateRole(roleName,id,userId);
        await userService.addRoleToUser(userId,role.id);
        reply.code(201);
      }catch(err:any){
        reply.code(err.code || 500).send({message:err.message});
      }
  }})
}

async function validateRole(roleName:string,id:number,userId:number){
  const userService = new UsersService();
  const roleService = new RolesServices();
  const resp = await Promise.allSettled([
    roleService.getRole({name:roleName,companyId:id}),
    userService.userBelogsToCompany(userId,id)]);

  const [role,isValid] = resp.map((r:any)=>r.value);
  if(!role){
    throw new HttpError('Role not found',404);
  }

  if(!isValid){
    throw new HttpError('User does not belong to company',404);
  }

  const hasRole = await userService.userHasRole(userId,role.id);
  if(hasRole){
    throw new HttpError('User already has this role',400);
  }

  return {
    userService,
    role
  }
}
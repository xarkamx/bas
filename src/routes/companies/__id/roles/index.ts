import type { FastifyPluginAsync } from "fastify";
import { RolesServices } from '../../../../services/roles/rolesServices';
import { UsersService } from '../../../../services/users/users.service';
import { CompanyService } from '../../../../services/companies/companyService';

 const Roles: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  
  fastify.route({
    method: "POST",
    url: "/",
    async handler (_request, reply) {
      const {roleName:name}:any = _request.body;
      const {id:token}:any = _request.params;
      const {id}:any = _request.user;
      const roles = new RolesServices();
      const userService = new UsersService();
      const companyService = new CompanyService();
     
      try{
        const company = await companyService.getCompany(token);
        const validUser = await userService.userBelogsToCompany(id,company.id);
        if(!validUser ) {
          reply.code(401);
          return {message:'User not authorized'};
        }

        await roles.addRole({name,companyId:company.id});
        reply.code(201);
      }catch(err: any){
        reply.code(err.status).send({message:err.message});
      }
      
      
    }
  });

};

export default Roles;
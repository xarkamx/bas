import type { FastifyPluginAsync } from "fastify";
import { RolesServices } from '../../../../services/roles/rolesServices';
import { UsersService } from '../../../../services/users/users.service';
import { HttpError } from '../../../../errors/HttpError';

 const Roles: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  
  fastify.route({
    method: "POST",
    url: "/",
    config: {
      auth:{
        companyOnly:true,
      roles:['admin','master']
      }
    },
    async handler (_request, reply) {
      const {roleName:name}:any = _request.body;
      const {id,company}:any = _request.user;
      const roles = new RolesServices();
      const userService = new UsersService();
        const validUser = await userService.userBelogsToCompany(id,company.id);
        if(!validUser ) {
          throw new HttpError('User not found',404);
        }

        await roles.addRole({name,companyId:company.id});
        return {message:'Role created',status:201,data:{name}};
    }
  });

  fastify.route({
    method: "GET",
    url: "/",
    config: {
      auth:{
        companyOnly:true,
      }
    },
    async handler (_request, reply) {
      const {company}:any = _request.user;
      const roles = new RolesServices();
      const res = await roles.getRoles(company.id);
      return {message:'Roles list',status:200,data:res};
    }
  });

  fastify.route({
    method: "GET",
    url: "/:roleName/users",
    config: {
      auth:{
        companyOnly:true,
      }
    },
    async handler (_request, reply) {
      const {roleName}:any = _request.params;
      const {company}:any = _request.user;
      const roles = new RolesServices();
      const res = await roles.getUsersPerRoleName(roleName,company.id);
      return {message:'Role users',status:200,data:res};
      
    }
  });

  
};

export default Roles;
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

};

export default Roles;
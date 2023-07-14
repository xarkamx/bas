import type { FastifyPluginAsync } from "fastify";
import { UsersService } from '../../services/users/users.service';
import { HttpError } from '../../errors/HttpError';

const currentUser: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.route({
    method: "GET",
    url: "/",
    async handler(request:any, reply) {
      const { id } = request.user;
      const userService = new UsersService();
      const user = await userService.getFullUserDetails(id);

      if (!user) {
        reply.code(404);
        return { message: "User not found" };
      }

      return { message: "User found", status: 200, data: user };
    },
  });
  fastify.route({
    method:'POST',
    url:'/password',
    schema:{
      body:{
        type:'object',
        required:['newPassword'],
      }
    },
    async handler(request:any, reply){
      const {id} = request.user;
      const {newPassword} = request.body;
      const userService = new UsersService();
      const user = await userService.changePassword(id, newPassword);
      if(!user){
        throw new HttpError('User not found', 404)
      }
      
      return {message:'Password changed', status:200, data:user};
    }
  })
};

export default currentUser;

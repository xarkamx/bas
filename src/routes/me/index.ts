import type { FastifyPluginAsync } from "fastify";
import { UsersService } from '../../services/users/users.service';

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
};

export default currentUser;

import type { FastifyPluginAsync } from "fastify";
import { CompanyAuth } from '../../services/companies/companyAuth';
import { CompanyService } from '../../services/companies/companyService';

 const companies: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/",
    async onRequest (request, reply) {
      const {id}:any = request.user;
      const companyAuth = new CompanyAuth();
      return companyAuth.isMasterUser(id)
    },
    async handler (_request, reply) {
      const {name}:any = _request.body;
      const {email}:any = _request.user;
      const company = new CompanyService();
      
      return company.addCompany({name},email);
    }
  });
  fastify.route({
    method: "GET",
    url: "/",
    async handler (_request, reply) {
      reply.code(200);
    }
  })

};

export default companies;


import type { FastifyPluginAsync } from "fastify";
import { CompanyAuth } from '../../services/companies/companyAuth';
import { CompanyService } from '../../services/companies/companyService';

 const companies: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/",
    config: {
      auth:{
        roles: ['master'],
        powerUser: true
      }
    },
    schema: {
      body: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" }
        }
      }
    },
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
    config: {
      auth:{
        roles: ['master'],
        powerUser: true
      }
    },
    async handler (_request, reply) {
      const company = new CompanyService();
      return {message: 'ok',data: await company.getAllCompanies()};
    }
  })

};

export default companies;


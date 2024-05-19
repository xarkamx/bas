import { CompanyService } from '../../../../services/companies/companyService';

export default async function (fastify: any) {
  fastify.route({
    method: 'GET',
    url: '/',
    config: {
      auth:{
        roles: ['master','admin'],
        companyOnly: true
      }
    },
    async handler(request:any, reply:any)  {
      const {company} = request.user;
      const companyService = new CompanyService();
      const res = await companyService.getCompanyUsers(company.id);
      return {message:'Users list',status:200,data:res};
    }
  });
  fastify.route({
    method: 'POST',
    url: '/',
    schema:{
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          password: { type: 'string' },
          timeLimit: { type: 'string'},
        }
      },
    },
    config: {
      auth:{
        roles: ['master','admin'],
        companyOnly: true
      }
    },
    async handler(request:any, reply:any)  {
      const {id} = request.params;
      const {email,password,name,timeLimit} = request.body;
      const companyService = new CompanyService();
      const res = await companyService.createCompanyUser(id,{name,email,password,timeLimit});
      return {message:'User created',status:201,data:res};
    }
  });
}
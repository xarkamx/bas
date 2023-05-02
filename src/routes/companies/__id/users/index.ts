import { CompanyService } from '../../../../services/companies/companyService';

export default async function (fastify: any) {
  fastify.route({
    method: 'GET',
    url: '/',
    async handler(request:any, reply:any)  {
      const {id} = request.params;
      const companyService = new CompanyService();
      const company = await companyService.getCompany({token:id});
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
        }
      },
    },
    accessLevel: {
      level: 'company',
      roles: ['admin', 'master']
    },
    async handler(request:any, reply:any)  {
      const {id} = request.params;
      const {email,password,name} = request.body;
      const companyService = new CompanyService();
      const res = await companyService.createCompanyUser(id,{name,email,password});
      return {message:'User created',status:201,data:res};
    }
  });
}
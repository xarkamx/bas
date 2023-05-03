import { CompanyService } from '../../services/companies/companyService';


const userListRoute:any= {
  method: 'GET',
  url: '/',
  config:{
    public:true,
    auth:{
      roles:['admin','master'],
    }
  },
  
  async handler (request:any, reply:any) {
    const {user} = request;
    const companyService = new CompanyService();

    const ownerAccesibleCompanies = await companyService.getCompaniesByUser(user.id);
    const companies = ownerAccesibleCompanies.map((company:any) => company.id);
    const users = await companyService.getAllUsersInCompanies(companies);
    return {message:'Users list',status:200,data:users};
  },
}


export default userListRoute;
import { HttpError } from '../../errors/HttpError';
import { CompanyModel,  type ICompany } from '../../models/CompanyModel';
import { RolesModel } from '../../models/RolesModel';
import { type IUser } from '../../models/UserModel';
import { RolesServices } from '../roles/rolesServices';
import { UsersService } from '../users/users.service';

export class CompanyService {
  companyModel: CompanyModel;
  constructor() {
    this.companyModel = new CompanyModel();
  }

  async addCompany(company: ICompany,email:string) {
    const userService = new UsersService();
    const user = await userService.getUser({email});
    if(!user.id || !email) throw new HttpError('User not found',404);
    const companyId = await this.companyModel.addCompany(company);
    await this.companyModel.addUserToCompany(companyId[0],user.id);
    const [roleId] = await this.addMasterRole(companyId[0]);
    await this.addRoleToCompany(companyId[0],'admin');
    await this.addRoleToCompany(companyId[0],'user');
    await userService.addRoleToUser(user.id,roleId);
    const resultingCompany = await this.getCompanyById(companyId[0]);
    return {message:'Company created',status:201,company:resultingCompany};
  }

  async addUserToCompany(companyId: number, userId: number,timeLimit='8h') {
    const userService = new UsersService();
    const user = await userService.userBelogsToCompany(userId,companyId);
    if(user) {
      throw new HttpError('User already belongs to company',400);
    }
    
    return this.companyModel.addUserToCompany(companyId,userId,timeLimit);
  }

  async addMasterRole(companyId: number) {
    return this.addRoleToCompany(companyId,'master');
  }

  async addRoleToCompany(companyId: number, role: string) {
    const roleModel = new RolesModel();
    const roleExists = await roleModel.getRole({name:role,companyId});
    if(roleExists) throw new HttpError('Role already exists',400);
    const res = await roleModel.addRole({name:role,companyId});
    return res;
  }

  async getCompany(query: any) {
    return this.companyModel.getCompany(query);
  }
  
  async getCompanyById(id: number) {
    const res = await this.companyModel.getCompany({id});
    return res;
  }

  async getCompanyUsers(id: number) {
    return this.companyModel.getCompanyUsers(id);
  }

  async getCompanyDomains(id: number) {
    const res = await this.companyModel.getCompanyDomains(id);
    return res;
  }

  async getCompanyUserByEmail(id: number, email: string) {
    return this.companyModel.getCompanyUserByEmail(id,email);
  }

  async getCompanyUserById(id: number, userId: number) {
    const user:any=  await this.companyModel.getCompanyUsers(id).where({'users.id':userId}).first();
    if(!user) throw new HttpError('User not found in Company',404);
    const roleService = new RolesServices();
    const roles = await roleService.getRoleByUserId(userId,id);
    user.roles = roles?.map((role:any) => role.name) || [];
    return user;
  }

  async createCompanyUser(token:string,userDetails:IUser) {
    const company  = await this.getCompany({token});
    const userService = new UsersService();

      if(!company) {
        throw new HttpError('Company not found',404);
      }

      const [userId] = await userService.addUser({
        name:userDetails.name,
        email:userDetails.email,
        password:userDetails.password
      });
      await this.addUserToCompany(company.id,userId,userDetails.timeLimit) 
      return {
        userId,
        companyId:company.id,
        ...userDetails
      };
  }

  async getCompaniesByUser(userId: number) {
    return this.companyModel
      .db('companies')
      .leftJoin('company_users','companies.id','company_users.company_id')
      .where({'company_users.user_id':userId})
      .select('companies.id','companies.name');
  }

  async getAllUsersInCompanies(companies:number[]){
    return this.companyModel
    .db('companies')
    .leftJoin('company_users','companies.id','company_users.company_id')
    .leftJoin('users','company_users.user_id','users.id')
    .whereIn('companies.id',companies)
    .select('users.name','users.email','companies.name');
  }

  async getAllCompanies() {
    return this.companyModel.db('companies').select('id','name');
  }

  async removeUserFromCompany(companyId: number, userId: number) {
    const userService = new UsersService();
    await this.companyModel.db.transaction(async (trx: any) => {
      await trx.delete().from('company_users').where({company_id:companyId, user_id:userId});
      await trx.delete().from('users_roles').where({user_id:userId});
    });
    await userService.removeUserById(userId);
    return {success:true};
  }
}

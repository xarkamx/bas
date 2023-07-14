import { HttpError } from '../../errors/HttpError';
import { type queryUser, UserModel } from '../../models/UserModel';
import type { IUser } from '../../models/UserModel';
import { validatePassword } from '../../utils/passwordUtils';
import { CompanyService } from '../companies/companyService';
import { RolesServices } from '../roles/rolesServices';

export class UsersService {
  model: UserModel;
  constructor() {
    this.model = new UserModel();
  }

  async addUser(user:IUser) {
    const isUser =await this.model.getUser({email:user.email});
    if(isUser) throw new HttpError('User already exist', 400);
    return this.model.addUser(user);
  }

  async getUser(query: queryUser) {
    return this.model.getUser(query);
  }
  
  async addRoleToUser(userId: number, roleId: number) {
    return this.model.addRoleToUser(userId, roleId);
  }
  
  async userHasRole(userId: number, roleId: number) {
    return Boolean(await (this.model.userHasRole(userId, roleId)));
  }

  async getFullUserDetails(userId:number) {
    const companyService = new CompanyService();
    const rolesServices = new RolesServices();
    let companies = await companyService.getCompaniesByUser(userId);
    const roles = await rolesServices.getAllAvailableRolesForUser(userId);
    const user = await this.model.getUser({id:userId})
    companies = companies.map((company:any) => {
      const companyRoles = roles.filter((role:any) => role.company === company.name);
      return {
        ...company,
        roles: companyRoles.map((role:any) => role.role),
      };
    });
    return {
      user: {
        email: user.email,
        name: user.name,
        id: user.id,
        creationDate: user.created_at,
      },
      companies,
    }
  }

  async removeUserById(userId:number) {
    return this.model.removeUserById(userId);
  }

  async changePassword(userId:number, newPassword:string) {
    return this.model.changePassword(userId, newPassword);
  }

  

  async singUp(user:IUser) {
    const userExist = await this.getUser({email:user.email, name:user.name});
    return validatePassword(user.password, userExist.password);
  }

  async userBelogsToCompany(userId: number, companyId: number) {
    return Boolean(await this.model.userBelogsToCompany(userId, companyId));
  }

  
}

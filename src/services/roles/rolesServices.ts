import { HttpError } from '../../errors/HttpError';
import { RolesModel, type roleType } from '../../models/RolesModel';
import { CompanyService } from '../companies/companyService';

export class RolesServices {
  roleModel: RolesModel;
  constructor() {
    this.roleModel = new RolesModel();
  }

  async addRole(role: roleType) {
    const company = new CompanyService();
    const val =await company.getCompanyById(role.companyId);
    if(!val) throw new HttpError('Company not found',404)
    const validRole = await this.roleModel.getRole(role);
    if(validRole) return [validRole.id];
    const res = await this.roleModel.addRole(role);
    return res;
  }

  async getRole(role: roleType) {
    return this.roleModel.getRole(role);
  }

  async getRoleByUserId(userId: number, companyId: number) {
    return this.roleModel.getRolesByUserId(userId, companyId);
  }

  async getAllAvailableRolesForUser(userId:number) {
    return this.roleModel.db('users_roles')
      .leftJoin('roles', 'roles.id', 'users_roles.role_id')
      .rightJoin('companies', 'companies.id', 'roles.company_id')
      .select('roles.name as role', 'companies.name as company')
      .where('users_roles.user_id', userId);
  }

  async getUsersPerRoleName(roleName: string, companyId: number) {
    return this.roleModel.db('users_roles')
      .leftJoin('roles', 'roles.id', 'users_roles.role_id')
      .leftJoin('users', 'users.id', 'users_roles.user_id')
      .select('users.id', 'users.email', 'users.name')
      .where('roles.name', roleName)
      .andWhere('roles.company_id', companyId);
  }

  async getRoles(companyId: number) {
    return this.roleModel.db('roles').where({company_id: companyId});
  }

}


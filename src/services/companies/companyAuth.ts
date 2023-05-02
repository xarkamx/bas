import { HttpError } from '../../errors/HttpError';
import { CompanyService } from './companyService';

export class CompanyAuth{
  async  isMasterUser (userId: any) {
    return this.validUser(userId, 1,['master']);
  }

  async validUser (userId: number, companyId: number,roles:string[]) {
    const companyServices = new CompanyService();
    const user =  await companyServices.getCompanyUserById(companyId,userId);
    console.log(user)
    const hasRoles = roles.some((role) => user.roles?.includes(role));
    if(!hasRoles) throw new HttpError('User does not have permissions',403);
    return user;
  }
  
}
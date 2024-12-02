
import { db } from '../config/db';
import { generateRandomString } from '../utils/helpers';
import { snakeCaseReplacer } from '../utils/objectFormat';

export class CompanyModel {
  tableName: string;
  db: any;
  constructor() {
    this.tableName = 'companies';
    this.db = db;
  }

  async addCompany(company: ICompany) {
    const compObj:any=snakeCaseReplacer(company);
    compObj.token = `${company.name}-${generateRandomString()}`;
    const res = await this.db
      .transaction(async (trx: any) => 
      trx.insert(compObj).into(this.tableName)
      );
    return res;
  }

  async addUserToCompany(companyId: number, userId: number, timeLimit='8h') {
    const res = await this.db
      .transaction(async (trx: any) => 
      trx.insert({company_id:companyId, user_id:userId,time_limit:timeLimit}).into('company_users')
      );
    return res;
  }

  async getCompany(query:any) {
    const table = this.db(this.tableName);
    const element: any = query;
    Object.keys(query).forEach((key) => {
      if(element[key])
      table.orWhere(key, element[key]);
    });
    return table.first();
  }

  getCompanyUsers(id: number) {
    return this.db('company_users')
    .select(
      'users.id',
      'users.name',
      'users.email',
      'company_users.time_limit',
        )
    .join('users', 'users.id', 'company_users.user_id')
    .where({'company_users.company_id':id});
  }

  async getCompanyUserByEmail(id: number, email: string) {
    return this.getCompanyUsers(id).where({email});
  }

  async getCompanyDomains(id: number) {
    return this.db('company_domains')
    .select('domains.domain')
    .rightJoin('domains', 'domains.id', 'company_domains.domain_id')
    .where({'company_domains.company_id':id});
  }
}

export type ICompany = {
  name: string;
  addressId?: number;
}
export type UserWithDomainName = {
  name: string;
  email: string;
  domain_name: string;
  role_name: string;
}
import { db } from '../config/db';

export class DeviceModel {
  db: any;
  tableName: string;
  constructor() {
    this.tableName = 'devices';
    this.db = db;
  }

  async addDevice(device: deviceType) {
    const res = await this.db
      .transaction(async (trx:any) => 
      trx.insert(device).into(this.tableName)
      );
    return res;
  }

  getDevice(id:number) {
    const table = this.db(this.tableName);
    return table.where({id}).first();
  }

  async getAllDevices(query:Partial<deviceType>) {
    const table = this.db(this.tableName);
    const element: any = query;
    Object.keys(query).forEach((key) => {
      if(element[key])
      table.orWhere(key, element[key]);
    });
    return table;
  }
}

 type deviceType = {
  name: string;
  token: string;
  type: string;
  os: string;
  os_version: string;
  browser: string;
  brand: string;
  company_id: number;
  user_id: number;
}
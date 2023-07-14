import { DeviceModel } from '../../models/DeviceModel';
import { snakeCaseReplacer } from '../../utils/objectFormat';

export class DevicesService {
    model: any;
    constructor() {
        this.model = new DeviceModel();
    }

    async addDevice(device:deviceRequestType) {
        const toCamelCase = snakeCaseReplacer(device);
        return this.model.addDevice(toCamelCase);
    }

    async getDevice(id: number) {
        return this.model.getDevice(id);
    }

    async getAllDevices(device:Partial<deviceRequestType>) {
      const toCamelCase = snakeCaseReplacer(device);
        return this.model.getAllDevices(toCamelCase);
    }
}

type deviceRequestType = {
    name: string;
    token: string;
    type: string;
    os: string;
    osVersion: string;
    browser: string;
    brand: string;
    companyId: number;
    userId: number;
}
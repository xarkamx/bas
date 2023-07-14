import { DevicesService } from '../../../../services/devices/deviceService';

export default async function devices(fastify:any){
  fastify.route({
    method: 'POST',
    url: '/',
    config: {
      auth: {
        companyOnly: true,
        roles: ['master', 'admin','notificator'],
      }
    },
    schema: {
      body: {
        type: 'object',
        required: ['name', 'token','type','os','osVersion','browser','brand'],
        properties: {
          name: { type: 'string' },
          token: { type: 'string' },
          type: { type: 'string' },
          os: { type: 'string' },
          osVersion: { type: 'string' },
          browser: { type: 'string' },
          brand: { type: 'string' }
        },
      },
    },
    async handler (request:any, reply:any)  {
      const {id,company}:any = request.user;
      const service = new DevicesService();
      reply.code(201);
      return service.addDevice({...request.body,company_id:company.id,user_id:id});
    },
  });

  fastify.route({
    method: 'GET',
    url: '/',
    config: {
      auth: {
        companyOnly: true,
        roles: ['master', 'admin','notificator'],
      }
    },
    async handler (request:any, reply:any)  {
      const {id,company}:any = request.user;
      const service = new DevicesService();
      return service.getAllDevices({companyId:company.id,userId:id});
    }
  });

  fastify.route({
    method: 'GET',
    url: '/:deviceId',
    config: {
      auth: {
        companyOnly: true,
        roles: ['master', 'admin','notificator'],
      },
    },
    async handler (request:any, reply:any)  {
      const {deviceId} = request.params;
      const service = new DevicesService();
      return service.getDevice(deviceId);
    }
  });
}
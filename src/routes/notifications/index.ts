import { DevicesService } from '../../services/devices/deviceService';
import { NotificationService } from '../../services/notifications/notificationsService';

export default async function notifications(fastify:any){
  fastify.route({
    method: 'POST',
    url: '/',
    config: {
      auth: {
        roles: ['master', 'admin','notificator'],
      }
    },
    schema: {
      body: {
        type: 'object',
        required: ['title', 'body'],
        properties: {
          title: { type: 'string' },
          icon: { type: 'string' },
          body: { 
            type: 'string',
           },
          deviceId: { type: 'integer' },
          topic: { type: 'string' },
        },
      },
    },
    async handler (request, reply)  {
      const service = new NotificationService();
      const deviceService = new DevicesService();
      const resp = await deviceService.getDevice(request.body.deviceId);
      reply.code(201);
      return service.sendNotification({...request.body,token:resp.token});
    },
  });
}
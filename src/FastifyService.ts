

import closeWithGrace from "close-with-grace";
import { RolesServices } from './services/roles/rolesServices';
import { CompanyAuth } from './services/companies/companyAuth';
import { CompanyService } from './services/companies/companyService';
export function FastifyService(app:any){
  
// Delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async (opts: any) => {
  if (opts.err) {
    app.log.error(opts.err);
  }

  await app.close();
});

app.addHook("onClose", async (_instance:any, done:any) => {
  closeListeners.uninstall();
  done();
});

app.addHook("onRequest", async (request: any, reply:any) => {
  const {config} = request.context;
  try {
    if (config.public) {
      return;
    }

    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

app.addHook("preValidation", async (request: any, reply:any) => {
  const {auth} = request.context.config;
  const companyAuth = new CompanyAuth();
  const companyServices = new CompanyService();
  const roleService = new RolesServices();
  if(!auth) return;
  if(auth.powerUser) {
    await companyAuth.isMasterUser(request.user.id);
    request.user.company = {id:1};
    return;
  }

  if(auth.companyOnly) {
    const {id} = request.params;
    const company = await companyServices.getCompany({token:id});
    await companyAuth.validUser(request.user.id,company.id,auth.roles);
    request.user.company = company;
  }

  if(auth.roles) {
    let roles = await roleService.getAllAvailableRolesForUser(request.user.id);
    roles = roles.map((role:any) => role.role);
    
    const hasRoles = auth.roles.some((role:string) => roles.includes(role));
    if(!hasRoles) {
      reply.send({message: 'Unauthorized',statusCode: 401});
    }
  }
});
}
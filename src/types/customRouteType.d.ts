interface CustomRouteOptions {
  method: string;
  url: string;
  handler: (request: any, reply: any) => any;
  auth: {
    roles: string[];
    company?: boolean;
  };
}
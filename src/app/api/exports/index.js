import ExportsHandler from './handler';
import routes from './routes';

export  default {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { ExportsService, bookshelvesService, validator }) => {
    const exportsHandler = new ExportsHandler(ExportsService, bookshelvesService, validator);
    server.route(routes(exportsHandler));
  },
};

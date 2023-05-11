import ExportsHandler from './handler';

const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { ExportsService, bookshelvesService, validator }) => {
    const exportsHandler = new ExportsHandler(ExportsService, bookshelvesService, validator);
    server.route(routes(exportsHandler));
  },
};

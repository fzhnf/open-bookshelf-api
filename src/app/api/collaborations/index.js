import CollaborationsHandler from './handler';
import routes from './routes';

export default {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationsService, bookshelvesService, usersService, validator,
  }) => {
    // eslint-disable-next-line max-len
    const collaborationsHandler = new CollaborationsHandler(collaborationsService, bookshelvesService, usersService, validator);
    server.route(routes(collaborationsHandler));
  },
};

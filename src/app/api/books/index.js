import booksHandler from './handler';
import routes from './routes';

export default {
  name: 'books',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const booksHandler = new booksHandler(service, validator);
    server.route(routes(booksHandler));
  },
};

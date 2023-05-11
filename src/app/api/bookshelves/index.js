import bookshelfHandler from './handler';
import routes from './routes';

module.exports = {
  name: 'bookshelves',
  version: '1.0.0',
  register: async (server, { bookshelvesService, booksService, validator }) => {
    const bookshelfHandler = new bookshelfHandler(bookshelvesService, booksService, validator);
    server.route(routes(bookshelfHandler));
  },
};

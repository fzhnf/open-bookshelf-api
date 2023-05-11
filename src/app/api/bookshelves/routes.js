const routes = (handler) => [
  {
    method: 'POST',
    path: '/bookshelves',
    handler: handler.postbookshelfHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/bookshelves',
    handler: handler.getbookshelfHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/bookshelves/{id}',
    handler: handler.deletebookshelfByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'POST',
    path: '/bookshelves/{id}/books',
    handler: handler.postbookTobookshelfHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/bookshelves/{id}/books',
    handler: handler.getbookshelfAndbookById,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/bookshelves/{id}/books',
    handler: handler.deletebookFrombookshelfHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/bookshelves/{id}/activities',
    handler: handler.getbookshelfActivitiesById,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

export default routes;

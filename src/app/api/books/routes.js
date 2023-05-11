const routes = (handler) => [
  {
    method: 'POST',
    path: '/books',
    handler: handler.postbookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: handler.getbooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: handler.getbookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: handler.putbookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: handler.deletebookByIdHandler,
  },
];

export default routes;

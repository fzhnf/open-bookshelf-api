const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/bookshelves/{bookshelfId}',
    handler: handler.postExportbookshelfHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

export default routes;

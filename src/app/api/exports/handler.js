import autoBind from 'auto-bind';

class ExportsHandler {
  constructor(exportsService, bookshelveservice, validator) {
    this._exportsService = exportsService;
    this._bookshelveservice = bookshelveservice;
    this._validator = validator;

    autoBind(this);
  }

  async postExportbookshelfHandler(request, h) {
    this._validator.validateExportbookshelvesPayload(request.payload);

    const userId = request.auth.credentials.id;
    const { bookshelfId } = request.params;

    await this._bookshelveservice.verifybookshelfOwner(bookshelfId, userId);

    const message = {
      bookshelfId,
      targetEmail: request.payload.targetEmail,
    };

    await this._exportsService.sendMessage('export:bookshelf', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrian',
    });
    response.code(201);
    return response;
  }
}

export default ExportsHandler;

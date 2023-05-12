import autoBind from 'auto-bind';

class booksHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postbookHandler(request, h) {
    this._validator.validatebookPayload(request.payload);
    const bookId = await this._service.addbook(request.payload);

    const response = h.response({
      status: 'success',
      message: 'buku berhasil ditambahkan',
      data: {
        bookId,
      },
    });
    response.code(201);
    return response;
  }

  async getbooksHandler(request) {
    const books = await this._service.getbooks(request.query);
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }

  async getbookByIdHandler(request, h) {
    const { id } = request.params;
    const { dataSource, book } = await this._service.getbookById(id);

    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.header('X-Data-Source', dataSource);
    return response;
  }

  async putbookByIdHandler(request) {
    this._validator.validatebookPayload(request.payload);
    const { id } = request.params;

    await this._service.editbookId(id, request.payload);

    return {
      status: 'success',
      message: 'buku berhasil di edit',
    };
  }

  async deletebookByIdHandler(request) {
    const { id } = request.params;

    await this._service.deletebookById(id);

    return {
      status: 'success',
      message: 'buku berhasil di hapus',
    };
  }
}

export default booksHandler;

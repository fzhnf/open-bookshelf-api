import autoBind from 'auto-bind';

class BookshelvesHandler {
  constructor(BookshelvesService, booksService, validator) {
    this._BookshelvesService = BookshelvesService;
    this._bookservice = booksService;
    this._validator = validator;

    autoBind(this);
  }

  async postBookshelfHandler(request, h) {
    this._validator.validatePostBookshelfPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const BookshelfId = await this._BookshelvesService.addBookshelf(name, owner);

    const response = h.response({
      status: 'success',
      data: {
        BookshelfId,
      },
    });
    response.code(201);
    return response;
  }

  async getBookshelfHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const { dataSource, Bookshelves } = await this._BookshelvesService.getBookshelf(owner);

    const response = h.response({
      status: 'success',
      data: {
        Bookshelves,
      },
    });
    response.header('X-Data-Source', dataSource);
    return response;
  }

  async deleteBookshelfByIdHandler(request) {
    const { id: BookshelfId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._BookshelvesService.verifyBookshelfOwner(BookshelfId, userId);
    await this._BookshelvesService.deleteBookshelfById(BookshelfId, userId);

    return {
      status: 'success',
      message: 'Bookshelf berhasil di hapus',
    };
  }

  async postbookToBookshelfHandler(request, h) {
    this._validator.validatePostbookBookshelfPayload(request.payload);
    const { bookId } = request.payload;
    const { id: BookshelfId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._BookshelvesService.verifyBookshelfAccess(BookshelfId, userId);
    await this._bookservice.getbookById(bookId);
    await this._BookshelvesService.addbookToBookshelfById(BookshelfId, bookId);
    await this._BookshelvesService.addActivities(userId, BookshelfId, bookId, 'add');

    const response = h.response({
      status: 'success',
      message: 'buku berhasil ditambahkan kedalam Bookshelf',
    });
    response.code(201);
    return response;
  }

  async getBookshelfAndbookById(request) {
    const { id: BookshelfId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._BookshelvesService.verifyBookshelfAccess(BookshelfId, userId);
    const Bookshelf = await this._BookshelvesService.getbookFromBookshelfById(BookshelfId);

    return {
      status: 'success',
      data: {
        Bookshelf,
      },
    };
  }

  async deletebookFromBookshelfHandler(request) {
    this._validator.validateDeletebookBookshelfPayload(request.payload);
    const { bookId } = request.payload;
    const { id: BookshelfId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._BookshelvesService.verifyBookshelfAccess(BookshelfId, userId);
    await this._BookshelvesService.deletebookFromBookshelfById(BookshelfId, bookId);
    await this._BookshelvesService.addActivities(userId, BookshelfId, bookId, 'delete');

    return {
      status: 'success',
      message: 'buku berhasil dihapus dari Bookshelf',
    };
  }

  async getBookshelfActivitiesById(request) {
    const { id: BookshelfId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._BookshelvesService.verifyBookshelfAccess(BookshelfId, userId);
    const activities = await this._BookshelvesService.getActivities(BookshelfId);

    return {
      status: 'success',
      data: activities,
    };
  }
}

export default BookshelvesHandler;

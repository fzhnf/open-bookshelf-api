import autoBind from 'auto-bind';

class CollaborationsHandler {
  constructor(collaborationsService, bookshelvesService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._bookshelvesService = bookshelvesService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { bookshelfId, userId } = request.payload;

    await this._bookshelvesService.verifybookshelfOwner(bookshelfId, credentialId);
    await this._usersService.getUserById(userId);

    const collaborationId = await this._collaborationsService.addCollaboration(bookshelfId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { bookshelfId, userId } = request.payload;

    await this._bookshelvesService.verifybookshelfOwner(bookshelfId, credentialId);

    await this._collaborationsService.deleteCollaboration(bookshelfId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

export default CollaborationsHandler;

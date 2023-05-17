import {
  PostbookshelfPayloadSchema,
  PostbookbookshelfPayloadSchema,
  DeletebookbookshelfPayloadSchema,
} from './schema';
const InvariantError = require('../../errors/InvariantError');

const bookshelvesValidator = {
  validatePostbookshelfPayload: (payload) => {
    const validationResult = PostbookshelfPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostbookbookshelfPayload: (payload) => {
    const validationResult = PostbookbookshelfPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletebookbookshelfPayload: (payload) => {
    const validationResult = DeletebookbookshelfPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = bookshelvesValidator;

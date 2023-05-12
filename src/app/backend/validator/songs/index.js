const { bookPayloadSchema } = require('./schema');
const InvariantError = require('../../error/InvariantError');

const booksValidator = {
  validatebookPayload: (payload) => {
    const validationResult = bookPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
export default booksValidator;

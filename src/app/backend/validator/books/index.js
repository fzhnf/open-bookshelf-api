import { bookPayloadSchema } from './schema';
import InvariantError from '../../errors/InvariantError';

const booksValidator = {
  validatebookPayload: (payload) => {
    const validationResult = bookPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
export default booksValidator;

import ExportbookshelvesPayloadSchema from './schema';
import InvariantError from '../../errors/InvariantError';

const ExportsValidator = {
  validateExportbookshelvesPayload: (payload) => {
    const validationResult = ExportbookshelvesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default ExportsValidator;

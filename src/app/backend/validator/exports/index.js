const ExportbookshelvesPayloadSchema = require('./schema');
const InvariantError = require('../../error/InvariantError');

const ExportsValidator = {
  validateExportbookshelvesPayload: (payload) => {
    const validationResult = ExportbookshelvesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;

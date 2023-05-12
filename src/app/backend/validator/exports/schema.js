const Joi = require('joi');

const ExportbookshelvesPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export default ExportbookshelvesPayloadSchema;

import Joi  from 'joi';

const ExportbookshelvesPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export default ExportbookshelvesPayloadSchema;

const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  bookshelfId: Joi.string().required(),
  userId: Joi.string().required(),
});

export default { CollaborationPayloadSchema };

import Joi from('joi');

const PostbookshelfPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostbookbookshelfPayloadSchema = Joi.object({
  bookId: Joi.string().required(),
});

const DeletebookbookshelfPayloadSchema = Joi.object({
  bookId: Joi.string().required(),
});

export default {
  PostbookshelfPayloadSchema,
  PostbookbookshelfPayloadSchema,
  DeletebookbookshelfPayloadSchema,
};

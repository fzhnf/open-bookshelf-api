import Joi from "joi";
import InvariantError from "../errors/InvariantError";

export const validatePostRegisterPayload = (body) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  });

  const validationResult = schema.validate(body);

  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};
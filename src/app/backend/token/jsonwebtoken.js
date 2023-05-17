import jwt from "jsonwebtoken";
import AuthenticationError from "../errors/AuthenticationError";

export const generateToken = (userId) => {
  return jwt.sign(userId, process.env.JWT_SECRET);
};

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

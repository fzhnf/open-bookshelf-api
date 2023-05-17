import AuthenticationError from "@/backend/errors/AuthenticationError";
import { decodeToken } from "@/backend/token/jsonwebtoken";

const getTokenHandler = (request) => {
  const token = request.headers.get('authorization')?.split(" ")[1];

  if (!token) {
    throw new AuthenticationError("User belum login!");
  }

  return decodeToken(token);
}

export default getTokenHandler;
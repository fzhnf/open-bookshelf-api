import { NextResponse } from "next/server";
import errorHandler from "@/app/backend/utils/errorHandler";
import { generateToken } from "@/app/backend/token/jsonwebtoken";
import { addUser } from "@/app/backend/services/userService";
import { validatePostRegisterPayload } from "@/app/backend/validator/registerValidator";

export async function POST(request) {
  try {
    const body = await request.json();

    validatePostRegisterPayload(body);

    const { username, email, password } = body;

    const id = await addUser({ username, email, password });
    const token = generateToken(id);

    return NextResponse.json({
      status: "success",
      data: {
        token,
      }
    }, { status: 201 });
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
}

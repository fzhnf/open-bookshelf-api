import { NextResponse } from "next/server";

import errorHandler from "@/backend/utils/errorHandler";
import { generateToken } from "@/backend/services/tokenService";

import { verifyUserCrendential } from "@/backend/services/userService";
import { validatePostLoginPayload } from "@/backend/validators/loginValidator";

export async function POST(request) {
  try {
    const body = await request.json();

    validatePostLoginPayload(body);

    const { email, password } = body;

    const id = await verifyUserCrendential({ email, password });
    const token = generateToken(id);

    return NextResponse.json({
      status: "success",
      data: {
        token,
      }
    });
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
}
import { NextResponse } from "next/server";
import errorHandler from "@/backend/utils/errorHandler";
import getTokenHandler from "@/backend/utils/getTokenHandler";
import { validatePostBookPayload } from "@/backend/validators/bookValidator";
import { getBooks, addBook } from "@/backend/services/bookService";

export async function GET(request) {
  try {
    const userId = getTokenHandler(request);

    const books = await getBooks(userId);

    return NextResponse.json({
      status: 'success',
      data: {
        books
      }
    })
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
}

export async function POST(request) {
  try {
    const userId = getTokenHandler(request);
    const body = await request.json();

    validatePostBookPayload(body);

    const id = await addBook(userId, body);

    return NextResponse.json({
      status: 'success',
      data: {
        id
      }
    }, { status: 201 })
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
}

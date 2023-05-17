import { NextResponse } from "next/server";
import errorHandler from "@/backend/utils/errorHandler";
import getTokenHandler from "@/backend/utils/getTokenHandler";
import { validatePutBookPayload } from "@/backen/validators/bookValidator";
import { getBookById, editBookById, deleteBookById } from "@/backend/services/bookService";

export async function GET(request, { params }) {
  try {
    const userId = getTokenHandler(request);
    const bookId = params.id;

    const book = await getBookById({userId, bookId});

    return NextResponse.json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = getTokenHandler(request);
  
    const body = await request.json();
    validatePutBookPayload(body);

    const bookId = params.id;

    await editBookById(userId, bookId, body);

    return NextResponse.json({
      status: 'success',
      message: 'Buku berhasil diperbaharui!',
    });
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
}

export async function DELETE(request, { params } ) {
  try {
    const userId = getTokenHandler(request);
    const bookId = params.id;

    await deleteBookById({ userId, bookId });

    return NextResponse.json({
      status: 'success',
      message: 'Buku berhasil dihapus!',
    });
  } catch (error) {
    const { data, status } = errorHandler(error);

    return NextResponse.json({
      data,
    }, { status });
  }
} 
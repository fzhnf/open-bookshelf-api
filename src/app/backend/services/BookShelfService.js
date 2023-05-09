import { nanoid } from "nanoid";
import InvariantError from "@/backend/errors/InvariantError";
import AuthenticationError from "@/backend/errors/AuthenticationError";
import NotFoundError from "@/backend/errors/NotFoundError";
import prisma from "../libs/prismadb";

const _verifyBookShelfOwner = async ({ bookShelfId, userId}) => {
  const bookShelf = await prisma.book.findUnique({
    where: {
      id: bookShelfId,
    },
    select: {
      user_id: true
    },
  });

  if (!bookShelf) {
    throw new NotFoundError("Bookshelf tidak ditemukan");
  }

  if (bookShelf.user_id !== userId) {
    throw new AuthenticationError("Anda tidak berhak mengakses")
  }
}

export const addBookShelf = async (userId, name) => {
  const id = `bookshelf-${nanoid(16)}`;

  const bookshelf = await prisma.bookShelf.create({
    data:{
      id,
      name,
      user_id: userId
    },
    select:{
      id: true,
    }
  });
  if (!bookshelf){
    throw new InvariantError("Bookshelf gagal ditambahkan");
  }
  return bookshelf.id;
}

export const getBookShelf = async (userId) =>{
  const bookshelf = await prisma.bookshelf.findUnique({
    where:{
      user_id: userId,
    },
    select:{
      id: true,
      name: true,
    }
  });
  return bookshelf;
}

export const getBookShelfById = async ({userId, bookShelfId}) => {
  await _verifyBookShelfOwner({userId, bookShelfId});

  const bookshelf = await prisma.bookShelf.findUnique({
    where:{
      id: bookShelfId,
    },
    select:{
      id: true,
      name: true,
    }
  });
  return bookshelf;
}

export const editBookShelfById = async(
  userId,
  bookShelfId,
  {name}
) => {
  await _verifyBookShelfOwner({ userId, bookShelfId});

  const bookShelf = await prisma.book.update({
    where:{
      id: bookShelfId,
    },
    data:{
      name
    }
  });
  if (!bookShelf){
    throw new NotFoundError("Rak Buku gagal diperbarui, Id tidak ditemukan")
  }
}

export const deleteBookShelfById = async ({ userId, bookShelfId}) => {
  await _verifyBookShelfOwner({ userId, bookShelfId});

  const bookshelf = await prisma.book.delete({
    where:{
      id: bookShelfId,
    },
  });
  if (!bookshelf){
    throw new InvariantError("Gagak Menghapus rak buku!")
  }
}
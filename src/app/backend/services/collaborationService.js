import { nanoid } from "nanoid";
import InvariantError from "@/backend/errors/InvariantError";

import prisma from "../libs/prismadb";

const _verifyCollaboration = async ({ userId, bookshelfId }) => {
  const collaborator = await prisma.collaborator.findUnique({
    where: {
      id: userId,
    },
    select: {
      user_id: true,
    },
  });

  if (!collaborator){
    throw new InvariantError(" Tidak dapat membuat collaboration")
  }
}

export const addCollaboration = async (userId, bookShelfId) => {
  const id = `collaboration-${nanoid(16)}`;

  const collaboration = await prisma.collaboration.create({
    data: {
      id,
      bookshelfId: bookShelfId,
      user_id: userId, //dipertanyakan
    },
    select: {
      id: true,
    }
  });

  if (!collaboration) {
    throw new InvariantError("Gagal Mmenambahkan kolaborasi");
  }

  return collaboration.id;
}

export const getCollaboratorProfileById = async (id) => {
  const collaborator = await prisma.collaborator.findUnique({
    where: {
      id,
    },
    select:{
      bookShelfId: true
    }
  })
}
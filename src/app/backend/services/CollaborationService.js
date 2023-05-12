import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import InvariantError from '../error/InvariantError';

const prisma = new PrismaClient();


export const verifyNewCollaboration= async (bookshelfId, userId) => {
  const collaboration = await prisma.collaboration.findUnique({
    where: {
      bookshelfId_userId: {
        bookshelfId,
        userId,
      },
    },
  });

  if (collaboration) {
    throw new InvariantError('Collaborator sudah ada!');
  }
}

export const verifyCollaborator = async (bookshelfId, userId) => {
  const collaboration = await prisma.collaboration.findUnique({
    where: {
      bookshelfId_userId: {
        bookshelfId,
        userId,
      },
    },
  });

  if (!collaboration) {
    throw new InvariantError('Kolaborasi gagal diverifikasi');
  }
}

export const addCollaboration = async (bookshelfId, userId) => {
  await this.verifyNewCollaboration(bookshelfId, userId);

  const id = `collab-${nanoid(16)}`;

  const collaboration = await prisma.collaboration.create({
    data: {
      id,
      bookshelfId,
      userId,
    },
  });

  if (!collaboration) {
    throw new InvariantError('Collab gagal ditambahkan');
  }

  return collaboration.id;
}

export const deleteCollaboration= async (bookshelfId, userId) => {
  const collaboration = await prisma.collaboration.delete({
    where: {
      bookshelfId_userId: {
        bookshelfId,
        userId,
      },
    },
  });

  if (!collaboration) {
    throw new InvariantError('Collab gagal dihapus');
  }
}


export default CollaborationsService;

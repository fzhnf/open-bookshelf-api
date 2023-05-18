import prisma from '@/backend/libs/prismadb';
import InvariantError from '@/backend/errors/InvariantError';
import NotFoundError from '@/errors/NotFoundError';
import AuthorizationError from '@/errors/AuthorizationError';
import { bookshelvesbook, activities } from '@/backend/utils';

const prisma = new PrismaClient();



const verifybookshelfOwner = async(bookshelfId, userId) => {
  const bookshelf = await prisma.bookshelf.findUnique({
    where: { id: bookshelfId },
  });

  if (!bookshelf) {
    throw new NotFoundError('bookshelf tidak ditemukan');
  }

  if (bookshelf.owner !== userId) {
    throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

const verifybookshelfAccess = async (bookshelfId, userId) => {
  try {
    await this.verifybookshelfOwner(bookshelfId, userId);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    try {
      await this._collaborationService.verifyCollaborator(bookshelfId, userId);
    } catch {
      throw error;
    }
  }
}

const addbookshelf = async (name, owner) => {
  const bookshelf = await prisma.bookshelf.create({
    data: {
      id: `bookshelf-${nanoid(16)}`,
      name,
      owner,
    },
  });

  await this._cacheService.delete(`bookshelf:${owner}`);
  return bookshelf.id;
}

const getbookshelf = async (owner) => {
  try {
    const cachedBookshelves = await this._cacheService.get(`bookshelf:${owner}`);
    return {
      dataSource: 'cache',
      bookshelves: JSON.parse(cachedBookshelves),
    };
  } catch {
    const bookshelves = await prisma.bookshelf.findMany({
      where: {
        OR: [
          { owner },
          { collaborators: { some: { userId: owner } } },
        ],
      },
      include: {
        owner: true,
      },
    });

    await this._cacheService.set(`bookshelf:${owner}`, JSON.stringify(bookshelves));

    return {
      dataSource: 'database',
      bookshelves,
    };
  }
}

const deletebookshelfById = async (bookshelfId, owner) => {
  const bookshelf = await prisma.bookshelf.delete({
    where: { id: bookshelfId },
  });

  if (!bookshelf) {
    throw new InvariantError('bookshelf gagal dihapus');
  }

  await this._cacheService.delete(`bookshelf:${owner}`);
}

const addbookTobookshelfById = async (bookshelfId, bookId) => {
  await prisma.bookshelfBook.create({
    data: {
      id: `bookshelf_books-${nanoid(16)}`,
      bookId,
      bookshelfId,
    },
  });
}

const getbookFrombookshelfById = async (bookshelfId) => {
  const bookshelf = await prisma.bookshelf.findUnique({
    where: { id: bookshelfId },
    include: {
      books: {
        include: {
          book: true,
        },
      },
      owner: true,
    },
  });

  if (!bookshelf) {
    throw new NotFoundError('bookshelf Tidak ada');
  }

  return bookshelvebook(bookshelf);
}

const deletebookFrombookshelfById = async (bookshelfId, bookId) => {
  const bookshelf = await prisma.bookshelf.findUnique({
    where: { id: bookshelfId },
  });

  if (!bookshelf) {
    throw new NotFoundError('bookshelf tidak ditemukan');
  }

  await prisma.bookshelfBook.delete({
    where: {
      bookshelfId_bookId: {
        bookshelfId,
        bookId,
      },
    },
  });
}


const addActivities = async (userId, bookshelfId, bookId, action) => {
  const date = new Date().toISOString();

  const activity = await prisma.bookshelfBookActivity.create({
    data: {
      id: `activities-${nanoid(16)}`,
      bookshelfId,
      bookId,
      userId,
      action,
      time: date,
    },
  });

  if (!activity) {
    throw new InvariantError('Gagal menambahkan history');
  }
}

const getActivities = async (bookshelfId) => {
  const activities = await prisma.bookshelfBookActivity.findMany({
    where: {
      bookshelfId,
    },
    orderBy: {
      time: 'asc',
    },
    select: {
      user: {
        select: {
          username: true,
        },
      },
      book: {
        select: {
          title: true,
        },
      },
      action: true,
      time: true,
    },
  });

  if (activities.length === 0) {
    throw new NotFoundError('bookshelf Tidak ada');
  }

  return activities.map((activity) => ({
    username: activity.user.username,
    title: activity.book.title,
    action: activity.action,
    time: activity.time,
  }));
}


export default bookshelfService;

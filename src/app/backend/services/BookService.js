import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import InvariantError from '../error/InvariantError';
import NotFoundError from '../error/NotFoundError';

const prisma = new PrismaClient();

class BooksService {
  async addBook({
    title, year, author, description = null,
  }) {
    const book = await prisma.book.create({
      data: {
        id: `book-${nanoid(16)}`,
        title,
        year,
        author,
        description,
      },
    });

    if (!book) {
      throw new InvariantError('Buku gagal ditambahkan');
    }

    return book.id;
  }

  async getBooks({ title = '', author = '' }) {
    const books = await prisma.book.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' },
        author: { contains: author, mode: 'insensitive' },
      },
      select: {
        id: true,
        title: true,
        author: true,
      },
    });

    return books;
  }

  async getBookById(id) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
      });

      if (!book) {
        throw new NotFoundError('Buku tidak ditemukan');
      }

      return {
        dataSource: 'database',
        book,
      };
    } catch {
      throw new NotFoundError('Buku tidak ditemukan');
    }
  }

  async editBookById(id, {
    title, year, author, description = null,
  }) {
    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        year,
        author,
        description,
      },
    });

    if (!book) {
      throw new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan');
    }
  }

  async deleteBookById(id) {
    const book = await prisma.book.delete({
      where: { id },
    });

    if (!book) {
      throw new NotFoundError('Buku gagal dihapus. Id tidak ditemukan');
    }
  }
}

export default BooksService;

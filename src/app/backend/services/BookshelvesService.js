const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');
const AuthorizationError = require('../error/AuthorizationError');
const { bookshelvebook, activities } = require('../utils');

class bookshelvesService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async verifybookshelfOwner(bookshelfId, userId) {
    const query = {
      text: 'SELECT * FROM bookshelves WHERE id = $1',
      values: [bookshelfId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('bookshelf tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifybookshelfAccess(bookshelfId, userId) {
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

  async addbookshelf(name, owner) {
    const id = `bookshelf-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookshelves VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('bookshelf gagal ditambahkan');
    }

    await this._cacheService.delete(`bookshelf:${owner}`);
    return result.rows[0].id;
  }

  async getbookshelf(owner) {
    try {
      const result = await this._cacheService.get(`bookshelf:${owner}`);
      return {
        dataSource: 'cache',
        bookshelves: JSON.parse(result),
      };
    } catch {
      const query = {
        text: `SELECT bookshelves.id, bookshelves.name, users.username FROM bookshelves
        LEFT JOIN collaborations ON collaborations.bookshelf_id = bookshelves.id
        JOIN users ON users.id = bookshelves.owner
        WHERE bookshelves.owner = $1 OR collaborations.user_id = $1`,
        values: [owner],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`bookshelf:${owner}`, JSON.stringify(result.rows));

      return {
        dataSource: 'database',
        bookshelves: result.rows,
      };
    }
  }

  async deletebookshelfById(bookshelfId, owner) {
    const query = {
      text: 'DELETE FROM bookshelves WHERE id = $1 RETURNING id',
      values: [bookshelfId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('bookshelf gagal dihapus');
    }

    await this._cacheService.delete(`bookshelf:${owner}`);
  }

  async addbookTobookshelfById(bookshelfId, bookId) {
    const id = `bookshelf_books-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookshelf_books values($1, $2, $3) RETURNING id',
      values: [id, bookshelfId, bookId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
  }

  async getbookFrombookshelfById(bookshelfId) {
    const query = {
      text: `SELECT bookshelves.id, bookshelves.name, users.username,
      books.id AS book_id, books.title, books.performer FROM bookshelves
      JOIN bookshelf_books ON bookshelf_books.bookshelf_id = bookshelves.id 
      JOIN books ON books.id = bookshelf_books.book_id
      JOIN users ON users.id = bookshelves.owner
      WHERE bookshelves.id = $1`,
      values: [bookshelfId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('bookshelf Tidak ada');
    }

    return bookshelvebook(result.rows);
  }

  async deletebookFrombookshelfById(bookshelfId, bookId) {
    const query = {
      text: 'DELETE FROM bookshelf_books WHERE bookshelf_id = $1 AND book_id = $2 RETURNING id',
      values: [bookshelfId, bookId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('bookshelf tidak ditemukan');
    }
  }

  async addActivities(userId, bookshelfId, bookId, action) {
    const id = `activities-${nanoid(16)}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO bookshelf_book_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, bookshelfId, bookId, userId, action, date],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan history');
    }
  }

  async getActivities(bookshelfId) {
    const query = {
      text: `SELECT users.username, books.title, bookshelf_book_activities.action, 
      bookshelf_book_activities.time FROM bookshelf_book_activities
      INNER JOIN books on books.id = bookshelf_book_activities.book_id
      INNER JOIN users on users.id = bookshelf_book_activities.user_id
      WHERE bookshelf_book_activities.bookshelf_id = $1
      ORDER BY bookshelf_book_activities.time`,
      values: [bookshelfId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('bookshelf Tidak ada');
    }

    return activities(bookshelfId, result.rows);
  }
}

module.exports = bookshelvesService;

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../error/InvariantError');
const NotFoundError = require('../error/NotFoundError');
const { singlebookModel } = require('../utils');

class booksService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addbook({
    title, year, genre, performer, duration = null, 
  }) {
    const id = `book-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getbooks({ title = '', performer = '' }) {
    const query = {
      text: 'SELECT id, title, performer FROM books WHERE title iLIKE $1 AND performer iLIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getbookById(id) {
    try {
      const result = await this._cacheService.get(`book:${id}`);
      return {
        dataSource: 'cache',
        book: JSON.parse(result),
      };
    } catch {
      const query = {
        text: 'SELECT * FROM books WHERE id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Lagu tidak ditemukan');
      }

      const mappedResult = result.rows.map(singlebookModel)[0];

      await this._cacheService.set(`book:${id}`, JSON.stringify(mappedResult));

      return {
        dataSource: 'database',
        book: mappedResult,
      };
    }
  }

  async editbookId(id, {
    title, year, genre, performer, duration = null,
  }) {
    const query = {
      text: 'UPDATE books SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, id = $6 RETURNING id',
      values: [title, year, genre, performer, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }

    await this._cacheService.delete(`book:${id}`);
  }

  async deletebookById(id) {
    const query = {
      text: 'DELETE FROM books WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`book:${id}`);
  }
}

module.exports = booksService;

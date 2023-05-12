const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../error/InvariantError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyNewCollaboration(bookshelfId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE bookshelf_id = $1 AND user_id = $2',
      values: [bookshelfId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Collaborator sudah ada!');
    }
  }

  async verifyCollaborator(bookshelfId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE bookshelf_id = $1 AND user_id = $2',
      values: [bookshelfId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async addCollaboration(bookshelfId, userId) {
    await this.verifyNewCollaboration(bookshelfId, userId);

    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, bookshelfId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Collab gagal ditambahkan');
    }

    await this._cacheService.delete(`bookshelf:${userId}`);
    return result.rows[0].id;
  }

  async deleteCollaboration(bookshelfId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE bookshelf_id = $1 AND user_id = $2 RETURNING id',
      values: [bookshelfId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Collab gagal dihapus');
    }

    await this._cacheService.delete(`bookshelf:${userId}`);
  }
}

module.exports = CollaborationsService;

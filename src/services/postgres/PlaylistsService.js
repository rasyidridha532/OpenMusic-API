const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan!');
    }

    return rows[0];
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('User tidak valid!');
    }
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan!');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }
}

module.exports = PlaylistsService;

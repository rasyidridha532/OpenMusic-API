const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const { rows } = this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist!');
    }
  }

  async getListSongInPlaylist({ playlistId, userId }) {
    const query = {
      text: 'SELECT * FROM playlistsong',
      values: [],
    };
  }

  async deleteSongInPlaylist({ songId, userId, playlistId}) {

  }

  async verifyPlaylistAccess(id, owner) {

  }
}

module.exports = PlaylistSongsService;

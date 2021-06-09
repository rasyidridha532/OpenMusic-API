const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);

      const { name } = request.payload;

      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service
          .addPlaylist({ name, owner: credentialId });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);

        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async getPlaylistHandler(request) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return {
        status: 'success',
        data: {
          playlists: playlists
              .map((p) => ({
                id: p.id,
                name: p.name,
                username: p.owner,
              })),
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);

        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylist(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);

        return response;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server',
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = PlaylistsHandler;

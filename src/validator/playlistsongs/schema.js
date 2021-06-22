const Joi = require('joi');

const PostSongPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostSongPlaylistPayloadSchema,
};

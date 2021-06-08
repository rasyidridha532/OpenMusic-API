const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.integer().min(1900).max(2021).required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  duration: Joi.integer(),
});

module.exports = { SongPayloadSchema };

// import dotenv dan jalanin konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const songsService = new SongsService();
  const userService = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugins: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugins: users,
      options: {
        service: userService,
        validator: UsersValidator,
      },
    },
  ]),

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();

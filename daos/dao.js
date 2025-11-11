const actorDao = require('./api/actorDao'); 
const directorDao = require('./api/directorDao');
const genreDao = require('./api/genreDao');
const movieDao = require('./api/movieDao');
const productionDao = require('./api/productionDao');
const streamingPlatformDao = require('./api/streamingPlatformDao');

module.exports = {
  actor: actorDao,
  director: directorDao,
  genre: genreDao,
  movie: movieDao,
  production: productionDao,
  streamingPlatform: streamingPlatformDao
};
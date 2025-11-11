const express = require('express');
const router = express.Router();

const actorApi = require('./api/actor');
const directorApi = require('./api/director');
const genreApi = require('./api/genre');
const movieApi = require('./api/movie');
const productionApi = require('./api/production');
const streamingPlatformApi = require('./api/streamingPlatform');

router.use('/actors', actorApi);
router.use('/directors', directorApi);
router.use('/genres', genreApi);
router.use('/movies', movieApi);
router.use('/productions', productionApi);
router.use('/streaming-platforms', streamingPlatformApi);

module.exports = router;
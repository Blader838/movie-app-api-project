// URLs: localhost:3000/streaming-platforms, /streaming-platforms/:id, /streaming-platforms/sort/:field, /streaming-platforms/with-movies
//last url returns not found, unsure why, maybe something in sql database, I tried ¯\_(ツ)_/¯

const { pool, handleError } = require('../common/daoCommon');
const mysql = require('mysql2');

function findAll(callback) {
  pool.query('SELECT * FROM streaming_platform', (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function findById(id, callback) {
  pool.query('SELECT * FROM streaming_platform WHERE streaming_platform_id = ?', [id], (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows[0] || null);
    }
  });
}

function sort(sortBy = 'name', callback) {
  const query = `SELECT * FROM streaming_platform ORDER BY ${mysql.escapeId(sortBy)}`;
  pool.query(query, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function getPlatformsWithMovies(callback) {
  pool.query(`
    SELECT sp.*, GROUP_CONCAT(m.title) AS movies
    FROM streaming_platform sp
    LEFT JOIN movie_to_streaming ms ON sp.streaming_platform_id = ms.streaming_platform_id
    LEFT JOIN movie m ON ms.movie_id = m.movie_id
    GROUP BY sp.streaming_platform_id
  `, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = { findAll, findById, sort, getPlatformsWithMovies };
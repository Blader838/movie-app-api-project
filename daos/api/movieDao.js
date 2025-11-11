// URLs: localhost:3000/movies, /movies/:id, /movies/sort/:field, /movies/with-full-cast
//last url returns not found, unsure why, maybe something in sql database, I tried ¯\_(ツ)_/¯

const { pool, handleError } = require('../common/daoCommon');
const mysql = require('mysql2');

function findAll(callback) {
  pool.query('SELECT * FROM movie', (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function findById(id, callback) {
  pool.query('SELECT * FROM movie WHERE movie_id = ?', [id], (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows[0] || null);
    }
  });
}

function sort(sortBy = 'name', callback) {
  const query = `SELECT * FROM movie ORDER BY ${mysql.escapeId(sortBy)}`;
  pool.query(query, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function getMoviesWithFullCast(callback) {
  pool.query(`
    SELECT m.*,
      GROUP_CONCAT(DISTINCT a.first_name, ' ', a.last_name) AS actors,
      GROUP_CONCAT(DISTINCT d.first_name, ' ', d.last_name) AS directors,
      GROUP_CONCAT(DISTINCT g.genre) AS genres
    FROM movie m
    LEFT JOIN movie_to_actor ma ON m.movie_id = ma.movie_id
    LEFT JOIN actor a ON ma.actor_id = a.actor_id
    LEFT JOIN movie_to_director md ON m.movie_id = md.movie_id
    LEFT JOIN director d ON md.director_id = d.director_id
    LEFT JOIN movie_to_genre mg ON m.movie_id = mg.movie_id
    LEFT JOIN genre g ON mg.genre_id = g.genre_id
    GROUP BY m.movie_id
  `, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = { findAll, findById, sort, getMoviesWithFullCast };
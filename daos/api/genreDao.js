// URLs: localhost:3000/genres, /genres/:id, /genres/sort/:field, /genres/with-movie-count
//last url returns not found, unsure why, maybe something in sql database, I tried ¯\_(ツ)_/¯

const { pool, handleError } = require('../common/daoCommon');
const mysql = require('mysql2');

function findAll(callback) {
  pool.query('SELECT * FROM genre', (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function findById(id, callback) {
  pool.query('SELECT * FROM genre WHERE genre_id = ?', [id], (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows[0] || null);
    }
  });
}

function sort(sortBy = 'name', callback) {
  const query = `SELECT * FROM genre ORDER BY ${mysql.escapeId(sortBy)}`;
  pool.query(query, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function getGenresWithMovieCount(callback) {
  pool.query(`
    SELECT g.*, COUNT(mg.movie_id) AS movie_count
    FROM genre g
    LEFT JOIN movie_to_genre mg ON g.genre_id = mg.genre_id
    GROUP BY g.genre_id
  `, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = { findAll, findById, sort, getGenresWithMovieCount };
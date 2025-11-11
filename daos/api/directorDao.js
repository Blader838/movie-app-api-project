// URLs: localhost:3000/directors, /directors/:id, /directors/sort/:field, /directors/with-movies
//last url returns not found, unsure why, maybe something in sql database, I tried ¯\_(ツ)_/¯

const { pool, handleError } = require('../common/daoCommon');
const mysql = require('mysql2');

function findAll(callback) {
  pool.query('SELECT * FROM director', (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function findById(id, callback) {
  pool.query('SELECT * FROM director WHERE director_id = ?', [id], (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows[0] || null);
    }
  });
}

function sort(sortBy = 'name', callback) {
  const query = `SELECT * FROM director ORDER BY ${mysql.escapeId(sortBy)}`;
  pool.query(query, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function getDirectorsWithMovies(callback) {
  pool.query(`
    SELECT d.*, GROUP_CONCAT(m.title) AS movies
    FROM director d
    LEFT JOIN movie_to_director md ON d.director_id = md.director_id
    LEFT JOIN movie m ON md.movie_id = m.movie_id
    GROUP BY d.director_id
  `, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = { findAll, findById, sort, getDirectorsWithMovies };
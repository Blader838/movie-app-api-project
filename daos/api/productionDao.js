// URLs: localhost:3000/productions, /productions/:id, /productions/sort/:field, /productions/with-movies
//last url returns not found, unsure why, maybe something in sql database, I tried ¯\_(ツ)_/¯

const { pool, handleError } = require('../common/daoCommon');
const mysql = require('mysql2');

function findAll(callback) {
  pool.query('SELECT * FROM production', (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function findById(id, callback) {
  pool.query('SELECT * FROM production WHERE production_id = ?', [id], (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows[0] || null);
    }
  });
}

function sort(sortBy = 'name', callback) {
  const query = `SELECT * FROM production ORDER BY ${mysql.escapeId(sortBy)}`;
  pool.query(query, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function getProductionsWithMovies(callback) {
  pool.query(`
    SELECT p.*, GROUP_CONCAT(m.title) AS movies
    FROM production p
    LEFT JOIN movie m ON p.production_id = m.production_id
    GROUP BY p.production_id
  `, (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

module.exports = { findAll, findById, sort, getProductionsWithMovies };
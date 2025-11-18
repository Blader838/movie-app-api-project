// URLs: localhost:3000/productions, /productions/:id, /productions/sort/:field, /productions/with-movies, /productions/form (for add), POST /productions, /productions/:id/edit (for edit), PATCH /productions/:id

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

function sort(sortBy = 'production', callback) {
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

//still wip
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

function create(data, callback) {
  pool.query('INSERT INTO production (production) VALUES (?)', [data.production], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, { id: result.insertId });
    }
  });
}

function update(id, data, callback) {
  pool.query('UPDATE production SET production = ? WHERE production_id = ?', [data.production, id], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, result.affectedRows > 0);
    }
  });
}

module.exports = { findAll, findById, sort, getProductionsWithMovies, create, update };
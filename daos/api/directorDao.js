// URLs: localhost:3000/directors, /directors/:id, /directors/sort/:field, /directors/with-movies, /directors/form (for add), POST /directors, /directors/:id/edit (for edit), PATCH /directors/:id

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

function sort(sortBy = 'last_name', callback) {
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

//still wip
function getDirectorsWithMovies(callback) {
  pool.query(`
    SELECT d.*, CONCAT(d.first_name, ' ', d.last_name) AS full_name, GROUP_CONCAT(m.title) AS movies
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

function create(data, callback) {
  pool.query('INSERT INTO director (first_name, last_name) VALUES (?, ?)', [data.first_name, data.last_name], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, { id: result.insertId });
    }
  });
}

function update(id, data, callback) {
  pool.query('UPDATE director SET first_name = ?, last_name = ? WHERE director_id = ?', [data.first_name, data.last_name, id], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, result.affectedRows > 0);
    }
  });
}

module.exports = { findAll, findById, sort, getDirectorsWithMovies, create, update };
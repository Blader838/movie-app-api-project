// URLs: localhost:3000/actors, /actors/:id, /actors/sort/:field, /actors/with-movies, /actors/form (for add), POST /actors, /actors/:id/edit (for edit), PATCH /actors/:id

const { pool, handleError } = require('../common/daoCommon');
const mysql = require('mysql2');

function findAll(callback) {
  pool.query('SELECT * FROM actor', (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function findById(id, callback) {
  pool.query('SELECT * FROM actor WHERE actor_id = ?', [id], (err, rows) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, rows[0] || null);
    }
  });
}

function sort(sortBy = 'last_name', callback) {
  const query = `SELECT * FROM actor ORDER BY ${mysql.escapeId(sortBy)}`;
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
function getActorsWithMovies(callback) {
  pool.query(`
    SELECT a.*, CONCAT(a.first_name, ' ', a.last_name) AS full_name, GROUP_CONCAT(m.title) AS movies
    FROM actor a
    LEFT JOIN movie_to_actor ma ON a.actor_id = ma.actor_id
    LEFT JOIN movie m ON ma.movie_id = m.movie_id
    GROUP BY a.actor_id
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
  pool.query('INSERT INTO actor (first_name, last_name, img_url) VALUES (?, ?, ?)', [data.first_name, data.last_name, data.img_url], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, { id: result.insertId });
    }
  });
}

function update(id, data, callback) {
  pool.query('UPDATE actor SET first_name = ?, last_name = ?, img_url = ? WHERE actor_id = ?', [data.first_name, data.last_name, data.img_url, id], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, result.affectedRows > 0);
    }
  });
}

module.exports = { findAll, findById, sort, getActorsWithMovies, create, update };
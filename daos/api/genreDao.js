// URLs: localhost:3000/genres, /genres/:id, /genres/sort/:field, /genres/with-movie-count, /genres/form (for add), POST /genres, /genres/:id/edit (for edit), PATCH /genres/:id

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

function sort(sortBy = 'genre', callback) {
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

//still wip
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

function create(data, callback) {
  pool.query('INSERT INTO genre (genre) VALUES (?)', [data.genre], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, { id: result.insertId });
    }
  });
}

function update(id, data, callback) {
  pool.query('UPDATE genre SET genre = ? WHERE genre_id = ?', [data.genre, id], (err, result) => {
    if (err) {
      handleError(err);
      callback(err, null);
    } else {
      callback(null, result.affectedRows > 0);
    }
  });
}

module.exports = { findAll, findById, sort, getGenresWithMovieCount, create, update };
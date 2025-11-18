// URLs: localhost:3000/movies, /movies/:id, /movies/sort/:field, /movies/with-full-cast, /movies/form (for add), POST /movies, /movies/:id/edit (for edit), PATCH /movies/:id

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

function sort(sortBy = 'title', callback) {
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

//still wip
function getMoviesWithFullCast(callback) {
  pool.query(`
    SELECT m.*,
      GROUP_CONCAT(DISTINCT CONCAT(a.first_name, ' ', a.last_name)) AS actors,
      GROUP_CONCAT(DISTINCT CONCAT(d.first_name, ' ', d.last_name)) AS directors,
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

function create(data, callback) {
  pool.query(
    'INSERT INTO movie (title, rating, runtime, nationality, yr_released, budget, gross, production_id, showing, poster) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [data.title, data.rating, data.runtime, data.nationality, data.yr_released, data.budget, data.gross, data.production_id, data.showing, data.poster],
    (err, result) => {
      if (err) {
        handleError(err);
        callback(err, null);
      } else {
        callback(null, { id: result.insertId });
      }
    }
  );
}

function update(id, data, callback) {
  pool.query(
    'UPDATE movie SET title = ?, rating = ?, runtime = ?, nationality = ?, yr_released = ?, budget = ?, gross = ?, production_id = ?, showing = ?, poster = ? WHERE movie_id = ?',
    [data.title, data.rating, data.runtime, data.nationality, data.yr_released, data.budget, data.gross, data.production_id, data.showing, data.poster, id],
    (err, result) => {
      if (err) {
        handleError(err);
        callback(err, null);
      } else {
        callback(null, result.affectedRows > 0);
      }
    }
  );
}

module.exports = { findAll, findById, sort, getMoviesWithFullCast, create, update };
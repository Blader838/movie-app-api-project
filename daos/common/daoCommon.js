const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'moviedb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// errors
function handleError(error) {
  console.error('Database error:', error);
  throw new Error('An error occurred while querying the database');
}

module.exports = { pool, handleError };
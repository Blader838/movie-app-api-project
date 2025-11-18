const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const { pool } = require('./daos/common/daoCommon'); 

const router = require('./routes/router'); 

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use('/', router);

pool.query('SELECT 1', (err, rows) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Database connected');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
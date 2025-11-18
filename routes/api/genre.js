// routes/api/genre.js

const express = require('express');
const router = express.Router();
const { genre } = require('../../daos/dao');

router.get('/', (req, res) => {
  genre.findAll((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/form', (req, res) => {
  res.render('genre_add');
});

router.get('/sort/:field', (req, res) => {
  genre.sort(req.params.field, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/with-movie-count', (req, res) => {
  genre.getGenresWithMovieCount((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/:id/edit', (req, res) => {
  genre.findById(req.params.id, (err, data) => {
    if (err || !data) {
      res.status(404).send('Not found');
    } else {
      res.render('genre_edit', { genre: data });
    }
  });
});

router.get('/:id', (req, res) => {
  genre.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data || { message: 'Not found' });
    }
  });
});

router.post('/', (req, res) => {
  genre.create(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Create failed', details: err.message });
    } else {
      res.json({ message: 'Created', id: result.id });
    }
  });
});

router.patch('/:id', (req, res) => {
  genre.update(req.params.id, req.body, (err, success) => {
    if (err) {
      res.status(500).json({ error: 'Update failed', details: err.message });
    } else if (!success) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json({ message: 'Updated' });
    }
  });
});

module.exports = router;
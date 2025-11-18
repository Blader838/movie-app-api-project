// routes/api/movie.js

const express = require('express');
const router = express.Router();
const { movie, production } = require('../../daos/dao'); 

router.get('/', (req, res) => {
  movie.findAll((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/form', (req, res) => {
  production.findAll((err, prods) => {
    if (err) {
      res.status(500).send('Failed to load productions');
    } else {
      res.render('movie_add', { productions: prods });
    }
  });
});

router.get('/sort/:field', (req, res) => {
  movie.sort(req.params.field, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/with-full-cast', (req, res) => {
  movie.getMoviesWithFullCast((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/:id/edit', (req, res) => {
  movie.findById(req.params.id, (err, mov) => {
    if (err || !mov) {
      res.status(404).send('Not found');
    } else {
      production.findAll((err, prods) => {
        if (err) {
          res.status(500).send('Failed to load productions');
        } else {
          res.render('movie_edit', { movie: mov, productions: prods });
        }
      });
    }
  });
});

router.get('/:id', (req, res) => {
  movie.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data || { message: 'Not found' });
    }
  });
});

router.post('/', (req, res) => {
  movie.create(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Create failed', details: err.message });
    } else {
      res.json({ message: 'Created', id: result.id });
    }
  });
});

router.patch('/:id', (req, res) => {
  movie.update(req.params.id, req.body, (err, success) => {
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
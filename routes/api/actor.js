// routes/api/actor.js

const express = require('express');
const router = express.Router();
const { actor } = require('../../daos/dao');

router.get('/', (req, res) => {
  actor.findAll((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/form', (req, res) => {
  res.render('actor_add');
});

router.get('/sort/:field', (req, res) => {
  actor.sort(req.params.field, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/with-movies', (req, res) => {
  actor.getActorsWithMovies((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data);
    }
  });
});

router.get('/:id/edit', (req, res) => {
  actor.findById(req.params.id, (err, data) => {
    if (err || !data) {
      res.status(404).send('Not found');
    } else {
      res.render('actor_edit', { actor: data });
    }
  });
});

router.get('/:id', (req, res) => {
  actor.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Query failed' });
    } else {
      res.json(data || { message: 'Not found' });
    }
  });
});

router.post('/', (req, res) => {
  actor.create(req.body, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Create failed', details: err.message });
    } else {
      res.json({ message: 'Created', id: result.id });
    }
  });
});

router.patch('/:id', (req, res) => {
  actor.update(req.params.id, req.body, (err, success) => {
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
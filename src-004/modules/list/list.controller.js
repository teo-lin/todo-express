const express = require('express');
const listService = require('./list.service');

const router = express.Router();

function createList(req, res) {
  try {
    const list = listService.createList(req.body);
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function retrieveList(req, res) {
  try {
    const list = listService.retrieveList(req.params.id);
    res.json(list);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
    else res.status(500).json({ message: error.message });
  }
}

function updateList(req, res) {
  try {
    const list = listService.updateList(req.params.id, req.body);
    res.json(list);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
    else res.status(500).json({ message: error.message });
  }
}

function deleteList(req, res) {
  try {
    listService.deleteList(req.params.id);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
    else res.status(500).json({ message: error.message });
  }
}

router.post('/create', createList);
router.get('/list/:id', retrieveList);
router.put('/list/:id', updateList);
router.delete('/list/:id', deleteList);

module.exports = router;

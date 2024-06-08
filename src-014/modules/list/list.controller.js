const express = require('express');
const router = express.Router();
const listService = require('./list.service');

router.post('/create', createList);
router.get('/list/:id', retrieveList);
router.put('/list/:id', updateList);
router.delete('/list/:id', deleteList);

async function createList(req, res) {
  try {
    const list = await listService.createList(req.body);
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function retrieveList(req, res) {
  try {
    const list = await listService.retrieveList(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function updateList(req, res) {
  try {
    const list = await listService.updateList(req.params.id, req.body);
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function deleteList(req, res) {
  try {
    await listService.deleteList(req.params.id);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = router;

const express = require('express');
const ListService = require('./list.service');

class ListController {
  static createList(req, res) {
    try {
      const list = ListService.createList(req.body);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static retrieveList(req, res) {
    try {
      const list = ListService.retrieveList(req.params.id);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static updateList(req, res) {
    try {
      const list = ListService.updateList(req.params.id, req.body);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static deleteList(req, res) {
    try {
      ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

const listRouter = express.Router();
listRouter.post('/create', ListController.createList);
listRouter.get('/list/:id', ListController.retrieveList);
listRouter.put('/list/:id', ListController.updateList);
listRouter.delete('/list/:id', ListController.deleteList);

module.exports = listRouter;

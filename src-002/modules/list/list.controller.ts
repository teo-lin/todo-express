import express, { Router, Request, Response } from 'express';
import ListService from './list.service';
import { List } from '../interfaces';

class ListController {
  static createList(req: Request, res: Response): void {
    try {
      const list: List = ListService.createList(req.body);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveList(req: Request, res: Response): void {
    try {
      const list: List | undefined = ListService.retrieveList(req.params.id);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static updateList(req: Request, res: Response): void {
    try {
      const list: List = ListService.updateList(req.params.id, req.body);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static deleteList(req: Request, res: Response): void {
    try {
      ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

const listRouter: Router = express.Router();
listRouter.post('/create', ListController.createList);
listRouter.get('/list/:id', ListController.retrieveList);
listRouter.put('/list/:id', ListController.updateList);
listRouter.delete('/list/:id', ListController.deleteList);

export default listRouter;

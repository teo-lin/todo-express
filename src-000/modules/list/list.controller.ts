import express, { Router, Request, Response } from 'express';
import ListService from './list.service';
import { List } from '../interfaces';

class ListController {
  static async createList(req: Request, res: Response) {
    try {
      const newList: List = await ListService.createList(req.body);
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async retrieveList(req: Request, res: Response) {
    try {
      const list: List | undefined = await ListService.retrieveList(req.params.id);
      if (!list) return res.status(404).json({ message: 'List not found' });
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateList(req: Request, res: Response) {
    try {
      const updatedList: List = await ListService.updateList(req.params.id, req.body);
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteList(req: Request, res: Response) {
    try {
      await ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const listRouter: Router = express.Router();
listRouter.post('/create', ListController.createList);
listRouter.get('/list/:id', ListController.retrieveList);
listRouter.put('/list/:id', ListController.updateList);
listRouter.delete('/list/:id', ListController.deleteList);

export default listRouter;

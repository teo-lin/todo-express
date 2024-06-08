import express, { Request, Response, Router } from 'express';
import TaskService from './task.service';
import { Task } from '../interfaces';

class TaskController {
  static createTask(req: Request, res: Response): void {
    try {
      const task: Task = TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveTask(req: Request, res: Response): void {
    try {
      const task: Task | undefined = TaskService.retrieveTask(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static updateTask(req: Request, res: Response): void {
    try {
      const task: Task = TaskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static deleteTask(req: Request, res: Response): void {
    try {
      TaskService.deleteTask(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static completeTask(req: Request, res: Response): void {
    try {
      const task: Task = TaskService.completeTask(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

const taskRouter: Router = express.Router();

taskRouter.post('/create', TaskController.createTask);
taskRouter.get('/task/:id', TaskController.retrieveTask);
taskRouter.put('/task/:id', TaskController.updateTask);
taskRouter.delete('/task/:id', TaskController.deleteTask);
taskRouter.patch('/task/:id/complete', TaskController.completeTask);

export default taskRouter;

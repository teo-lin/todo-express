import express, { Request, Response, Router } from 'express';
import TaskService from './task.service';

class TaskController {
  static createTask(req: Request, res: Response) {
    try {
      const newTask = TaskService.createTask(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveTask(req: Request, res: Response) {
    try {
      const task = TaskService.retrieveTask(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static updateTask(req: Request, res: Response) {
    try {
      const updatedTask = TaskService.updateTask(req.params.id, req.body);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static deleteTask(req: Request, res: Response) {
    try {
      TaskService.deleteTask(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static completeTask(req: Request, res: Response) {
    try {
      const taskId = req.params.id;
      const task = TaskService.completeTask(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
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

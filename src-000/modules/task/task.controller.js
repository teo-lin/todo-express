const express = require('express');
const TaskService = require('./task.service');

class TaskController {
  static createTask(req, res) {
    try {
      const task = TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static retrieveTask(req, res) {
    try {
      const task = TaskService.retrieveTask(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static updateTask(req, res) {
    try {
      const task = TaskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static deleteTask(req, res) {
    try {
      TaskService.deleteTask(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static completeTask(req, res) {
    try {
      const task = TaskService.completeTask(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

const taskRouter = express.Router();
taskRouter.post('/create', TaskController.createTask);
taskRouter.get('/task/:id', TaskController.retrieveTask);
taskRouter.put('/task/:id', TaskController.updateTask);
taskRouter.delete('/task/:id', TaskController.deleteTask);
taskRouter.patch('/task/:id/complete', TaskController.completeTask);

module.exports = taskRouter;

const express = require('express');
const taskService = require('./task.service');

const router = express.Router();

function createTask(req, res) {
  try {
    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function retrieveTask(req, res) {
  try {
    const task = taskService.retrieveTask(req.params.id);
    res.json(task);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}

function updateTask(req, res) {
  try {
    const task = taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}

function deleteTask(req, res) {
  try {
    taskService.deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}

function completeTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = taskService.completeTask(taskId);
    res.json(task);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}

router.post('/create', createTask);
router.get('/task/:id', retrieveTask);
router.put('/task/:id', updateTask);
router.delete('/task/:id', deleteTask);
router.patch('/task/:id/complete', completeTask);

module.exports = router;

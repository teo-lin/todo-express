const express = require('express');
const UserService = require('./user.service');

class UserController {
  static createUser(req, res) {
    try {
      const user = UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static retrieveUser(req, res) {
    try {
      const user = UserService.retrieveUser(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static updateUser(req, res) {
    try {
      const user = UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static deleteUser(req, res) {
    try {
      UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

const userRouter = express.Router();
userRouter.post('/register', UserController.createUser);
userRouter.get('/user/:id', UserController.retrieveUser);
userRouter.put('/user/:id', UserController.updateUser);
userRouter.delete('/user/:id', UserController.deleteUser);

module.exports = userRouter;

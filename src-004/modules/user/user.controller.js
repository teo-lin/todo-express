const express = require('express')
const UserService = require('./user.service')

class UserController {
  static createUser(req, res) {
    try {
      const newUser = UserService.createUser(req.body)
      res.status(201).json(newUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  static retrieveUser(req, res) {
    try {
      const user = UserService.retrieveUser(req.params.id)
      if (!user) return res.status(404).json({ message: 'User not found' })
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  static updateUser(req, res) {
    try {
      const updatedUser = UserService.updateUser(req.params.id, req.body)
      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  static deleteUser(req, res) {
    try {
      UserService.deleteUser(req.params.id)
      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

const userRouter = express.Router()
userRouter.post('/register', UserController.createUser)
userRouter.get('/user/:id', UserController.retrieveUser)
userRouter.put('/user/:id', UserController.updateUser)
userRouter.delete('/user/:id', UserController.deleteUser)

module.exports = userRouter

const express = require('express');
const userService = require('./user.service');

const router = express.Router();

function createUser(req, res) {
  try {
    const user = userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function retrieveUser(req, res) {
  try {
    const user = userService.retrieveUser(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
    else res.status(500).json({ message: error.message });
  }
}

function updateUser(req, res) {
  try {
    const user = userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
    else res.status(500).json({ message: error.message });
  }
}

function deleteUser(req, res) {
  try {
    userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
    else res.status(500).json({ message: error.message });
  }
}

router.post('/register', createUser);
router.get('/user/:id', retrieveUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;

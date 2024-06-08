const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.post('/register', createUser);
router.get('/user/:id', retrieveUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function retrieveUser(req, res) {
  try {
    const user = await userService.retrieveUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = router;

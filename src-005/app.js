const express = require('express');
const fs = require('fs');
const path = require('path');

// ROUTING FUNCTIONS
function createUser(req, res) {
  try {
    const user = userService_createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
function retrieveUser(req, res) {
  try {
    const user = userService_retrieveUser(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
    else res.status(500).json({ message: error.message });
  }
}
function updateUser(req, res) {
  try {
    const user = userService_updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
    else res.status(500).json({ message: error.message });
  }
}
function deleteUser(req, res) {
  try {
    userService_deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
    else res.status(500).json({ message: error.message });
  }
}

function createTask(req, res) {
  try {
    const task = taskService_createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
function retrieveTask(req, res) {
  try {
    const task = taskService_retrieveTask(req.params.id);
    res.json(task);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}
function updateTask(req, res) {
  try {
    const task = taskService_updateTask(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}
function deleteTask(req, res) {
  try {
    taskService_deleteTask(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}
function completeTask(req, res) {
  try {
    const taskId = req.params.id;
    const task = taskService_completeTask(taskId);
    res.json(task);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
    else res.status(500).json({ message: error.message });
  }
}

function createList(req, res) {
  try {
    const list = listService_createList(req.body);
    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
function retrieveList(req, res) {
  try {
    const list = listService_retrieveList(req.params.id);
    res.json(list);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
    else res.status(500).json({ message: error.message });
  }
}
function updateList(req, res) {
  try {
    const list = listService_updateList(req.params.id, req.body);
    res.json(list);
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
    else res.status(500).json({ message: error.message });
  }
}
function deleteList(req, res) {
  try {
    listService_deleteList(req.params.id);
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
    else res.status(500).json({ message: error.message });
  }
}

// SERVICES
function userService_createUser(userData) {
  const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
  const user = { userId: nextUserId, ...userData };

  data.users.push(user);
  data.lastUserId = nextUserId;

  const { password, ...maskedUser } = user;
  return maskedUser;
}
function userService_retrieveUser(userId) {
  const user = data.users.find((user) => user.userId === userId);

  if (!user) throw new Error('Not Found');
  else {
    const { password, ...maskedUser } = user;
    return maskedUser;
  }
}
function userService_updateUser(userId, userData) {
  const userIndex = data.users.findIndex((user) => user.userId === userId);
  if (userIndex === -1) throw new Error('Not Found');
  const user = { ...data.users[userIndex], ...userData };

  data.users[userIndex] = user;

  const { password, ...maskedUser } = user;
  return maskedUser;
}
function userService_deleteUser(userId) {
  const totalRecords = data.users.length;

  data.users = data.users.filter((user) => user.userId !== userId);
  if (totalRecords === data.users.length) throw new Error('Not Found');
}

function taskService_createTask(taskData) {
  const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
  const task = { taskId: nextTaskId, ...taskData };

  data.tasks.push(task);
  data.lastTaskId = nextTaskId;

  return task;
}
function taskService_retrieveTask(taskId) {
  const task = data.tasks.find((task) => task.taskId === taskId);
  if (!task) throw new Error('Not Found');
  else return task;
}
function taskService_updateTask(taskId, taskData) {
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
  if (taskIndex === -1) throw new Error('Not Found');
  const task = { ...data.tasks[taskIndex], ...taskData };

  data.tasks[taskIndex] = task;

  return task;
}
function taskService_deleteTask(taskId) {
  const totalRecords = data.tasks.length;

  data.tasks = data.tasks.filter((task) => task.taskId !== taskId);
  if (totalRecords === data.tasks.length) throw new Error('Not Found');
}
function taskService_completeTask(taskId) {
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);

  if (taskIndex === -1) throw new Error('Not Found');
  else {
    data.tasks[taskIndex].isComplete = true;
    return data.tasks[taskIndex];
  }
}

function listService_createList(listData) {
  const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
  const list = { listId: nextListId, ...listData };

  data.lists.push(list);
  data.lastListId = nextListId;

  return list;
}
function listService_retrieveList(listId) {
  const list = data.lists.find((list) => list.listId === listId);
  if (!list) throw new Error('Not Found');
  else return list;
}
function listService_updateList(listId, listData) {
  const listIndex = data.lists.findIndex((list) => list.listId === listId);
  if (listIndex === -1) throw new Error('Not Found');
  const list = { ...data.lists[listIndex], ...listData };

  data.lists[listIndex] = list;

  return list;
}
function listService_deleteList(listId) {
  const totalRecords = data.lists.length;

  data.lists = data.lists.filter((list) => list.listId !== listId);
  if (totalRecords === data.lists.length) throw new Error('Not Found');
}

// DATABASE
const PATH = path.join(__dirname, './db.json');
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

// ROUTER
const app = express();
const router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
router.post('/users/register', createUser);
router.get('/users/user/:id', retrieveUser);
router.put('/users/user/:id', updateUser);
router.delete('/users/user/:id', deleteUser);
router.post('/tasks/create', createTask);
router.get('/tasks/task/:id', retrieveTask);
router.put('/tasks/task/:id', updateTask);
router.delete('/tasks/task/:id', deleteTask);
router.patch('/tasks/task/:id/complete', completeTask);
router.post('/lists/create', createList);
router.get('/lists/list/:id', retrieveList);
router.put('/lists/list/:id', updateList);
router.delete('/lists/list/:id', deleteList);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

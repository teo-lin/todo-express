const express = require('express');
const fs = require('fs');
const path = require('path');
const PATH = path.join(__dirname, './db.json');

// CONTROLLERS
class UserController {
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async retrieveUser(req, res) {
    try {
      const user = await UserService.retrieveUser(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
class TaskController {
  static async createTask(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async retrieveTask(req, res) {
    try {
      const task = await TaskService.retrieveTask(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateTask(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async completeTask(req, res) {
    try {
      const taskId = req.params.id;
      const task = await TaskService.completeTask(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
class ListController {
  static async createList(req, res) {
    try {
      const list = await ListService.createList(req.body);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async retrieveList(req, res) {
    try {
      const list = await ListService.retrieveList(req.params.id);
      if (!list) return res.status(404).json({ message: 'List not found' });
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async updateList(req, res) {
    try {
      const list = await ListService.updateList(req.params.id, req.body);
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async deleteList(req, res) {
    try {
      await ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// SERVICES
class UserService {
  static async createUser(userData) {
    const data = DatabaseService.getData(PATH);
    const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
    const user = { userId: nextUserId, ...userData };
    data.users.push(user);
    data.lastUserId = nextUserId;
    DatabaseService.setData(PATH, data);
    delete user.password;
    return user;
  }
  static async retrieveUser(userId) {
    const data = DatabaseService.getData(PATH);
    const user = data.users.find((user) => user.userId === userId);
    delete user.password;
    return user;
  }
  static async updateUser(userId, userData) {
    const data = DatabaseService.getData(PATH);
    const userIndex = data.users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) throw new Error('User not found');
    data.users[userIndex] = { ...data.users[userIndex], ...userData };
    DatabaseService.setData(PATH, data);
    const user = data.users[userIndex];
    delete user.password;
    return user;
  }
  static async deleteUser(userId) {
    const data = DatabaseService.getData(PATH);
    data.users = data.users.filter((user) => user.userId !== userId);
    DatabaseService.setData(PATH, data);
  }
}
class ListService {
  static async createList(listData) {
    const data = DatabaseService.getData(PATH);
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
    const list = { listId: nextListId, ...listData };
    data.lists.push(list);
    data.lastListId = nextListId;
    DatabaseService.setData(PATH, data);
    return list;
  }
  static async retrieveList(listId) {
    const data = DatabaseService.getData(PATH);
    return data.lists.find((list) => list.listId === listId);
  }
  static async updateList(listId, listData) {
    const data = DatabaseService.getData(PATH);
    const listIndex = data.lists.findIndex((list) => list.listId === listId);
    if (listIndex === -1) throw new Error('List not found');
    data.lists[listIndex] = { ...data.lists[listIndex], ...listData };
    DatabaseService.setData(PATH, data);
    return data.lists[listIndex];
  }
  static async deleteList(listId) {
    const data = DatabaseService.getData(PATH);
    data.lists = data.lists.filter((list) => list.listId !== listId);
    DatabaseService.setData(PATH, data);
  }
}
class TaskService {
  static async createTask(taskData) {
    const data = DatabaseService.getData(PATH);
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const task = { taskId: nextTaskId, ...taskData };
    data.tasks.push(task);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(PATH, data);
    return task;
  }
  static async retrieveTask(taskId) {
    const data = DatabaseService.getData(PATH);
    return data.tasks.find((task) => task.taskId === taskId);
  }
  static async updateTask(taskId, taskData) {
    const data = DatabaseService.getData(PATH);
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData };
    DatabaseService.setData(PATH, data);
    return data.tasks[taskIndex];
  }
  static async deleteTask(taskId) {
    const data = DatabaseService.getData(PATH);
    data.tasks = data.tasks.filter((task) => task.taskId !== taskId);
    DatabaseService.setData(PATH, data);
  }
  static async completeTask(taskId) {
    const data = DatabaseService.getData(PATH);
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;
    DatabaseService.setData(PATH, data);
    return data.tasks[taskIndex];
  }
}

class DatabaseService {
  static getData(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  static setData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
  }
}

// DATABASE - onDisk

// ROUTER
const app = express();
const router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
router.post('/users/register', UserController.createUser);
router.get('/users/user/:id', UserController.retrieveUser);
router.put('/users/user/:id', UserController.updateUser);
router.delete('/users/user/:id', UserController.deleteUser);
router.post('/tasks/create', TaskController.createTask);
router.get('/tasks/task/:id', TaskController.retrieveTask);
router.put('/tasks/task/:id', TaskController.updateTask);
router.delete('/tasks/task/:id', TaskController.deleteTask);
router.patch('/tasks/task/:id/complete', TaskController.completeTask);
router.post('/lists/create', ListController.createList);
router.get('/lists/list/:id', ListController.retrieveList);
router.put('/lists/list/:id', ListController.updateList);
router.delete('/lists/list/:id', ListController.deleteList);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

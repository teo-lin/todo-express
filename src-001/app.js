const express = require('express');
const fs = require('fs');
const path = require('path');

// CONTROLLERS
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
class ListController {
  static createList(req, res) {
    try {
      const list = ListService.createList(req.body);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static retrieveList(req, res) {
    try {
      const list = ListService.retrieveList(req.params.id);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static updateList(req, res) {
    try {
      const list = ListService.updateList(req.params.id, req.body);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
  static deleteList(req, res) {
    try {
      ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

// SERVICES
class UserService {
  static createUser(userData) {
    const data = DatabaseService.getData();
    const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`;
    const user = { userId: nextUserId, ...userData };

    data.users.push(user);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static retrieveUser(userId) {
    const data = DatabaseService.getData();
    const user = data.users.find((user) => user.userId === userId);

    if (!user) throw new Error('Not Found');
    else {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId, userData) {
    const data = DatabaseService.getData();
    const userIndex = data.users.findIndex((user) => user.userId === userId);
    if (userIndex === -1) throw new Error('Not Found');
    const user = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = user;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static deleteUser(userId) {
    const data = DatabaseService.getData();
    const totalRecords = data.users.length;

    data.users = data.users.filter((user) => user.userId !== userId);
    if (totalRecords === data.users.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}
class TaskService {
  static createTask(taskData) {
    const data = DatabaseService.getData();
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const task = { taskId: nextTaskId, ...taskData };

    data.tasks.push(task);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return task;
  }

  static retrieveTask(taskId) {
    const data = DatabaseService.getData();

    const task = data.tasks.find((task) => task.taskId === taskId);
    if (!task) throw new Error('Not Found');
    else return task;
  }

  static updateTask(taskId, taskData) {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Not Found');
    const task = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = task;
    DatabaseService.setData(data);

    return task;
  }

  static deleteTask(taskId) {
    const data = DatabaseService.getData();
    const totalRecords = data.tasks.length;

    data.tasks = data.tasks.filter((task) => task.taskId !== taskId);
    if (totalRecords === data.tasks.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }

  static completeTask(taskId) {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);

    if (taskIndex === -1) throw new Error('Not Found');
    else {
      data.tasks[taskIndex].isComplete = true;
      DatabaseService.setData(data);
      return data.tasks[taskIndex];
    }
  }
}
class ListService {
  static createList(listData) {
    const data = DatabaseService.getData();
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`;
    const list = { listId: nextListId, ...listData };

    data.lists.push(list);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return list;
  }

  static retrieveList(listId) {
    const data = DatabaseService.getData();

    const list = data.lists.find((list) => list.listId === listId);
    if (!list) throw new Error('Not Found');
    else return list;
  }

  static updateList(listId, listData) {
    const data = DatabaseService.getData();
    const listIndex = data.lists.findIndex((list) => list.listId === listId);
    if (listIndex === -1) throw new Error('Not Found');
    const list = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = list;
    DatabaseService.setData(data);

    return list;
  }

  static deleteList(listId) {
    const data = DatabaseService.getData();
    const totalRecords = data.lists.length;

    data.lists = data.lists.filter((list) => list.listId !== listId);
    if (totalRecords === data.lists.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}

class DatabaseService {
  static #db;

  static init(filePath) {
    this.#db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  static getData() {
    return this.#db;
  }

  static setData(data) {
    this.#db = data;
  }

  static saveToDisk(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.#db), 'utf8');
  }
}

// DATABASE
const PATH = path.join(__dirname, './db.json');
DatabaseService.init(PATH);

// ROUTER
const app = express();
const router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
// router.get('/', (req, res) => res.json({ message: 'Hello World!' }));
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

const express = require('express');
const fs = require('fs');
const path = require('path');

// CONTROLLERS
class BaseController {
  static handleRequest(method, code = 200, message = null) {
    return async (req, res) => {
      try {
        const result = await method(req);
        if (message) return res.status(code).json({ message });
        res.status(code).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  }
}
class UserController extends BaseController {
  static createUser = BaseController.handleRequest((req) => UserService.createUser(req.body), 201);

  static retrieveUser = BaseController.handleRequest((req) =>
    UserService.retrieveUser(req.params.id)
  );

  static updateUser = BaseController.handleRequest((req) =>
    UserService.updateUser(req.params.id, req.body)
  );

  static deleteUser = BaseController.handleRequest(
    (req) => UserService.deleteUser(req.params.id),
    200,
    'User deleted successfully'
  );
}
class TaskController extends BaseController {
  static createTask = BaseController.handleRequest((req) => TaskService.createTask(req.body), 201);

  static retrieveTask = BaseController.handleRequest((req) =>
    TaskService.retrieveTask(req.params.id)
  );

  static updateTask = BaseController.handleRequest((req) =>
    TaskService.updateTask(req.params.id, req.body)
  );

  static deleteTask = BaseController.handleRequest(
    (req) => TaskService.deleteTask(req.params.id),
    200,
    'Task deleted successfully'
  );

  static completeTask = BaseController.handleRequest((req) =>
    TaskService.completeTask(req.params.id)
  );
}
class ListController extends BaseController {
  static createList = BaseController.handleRequest((req) => ListService.createList(req.body), 201);

  static retrieveList = BaseController.handleRequest((req) =>
    ListService.retrieveList(req.params.id)
  );

  static updateList = BaseController.handleRequest((req) =>
    ListService.updateList(req.params.id, req.body)
  );

  static deleteList = BaseController.handleRequest(
    (req) => ListService.deleteList(req.params.id),
    200,
    'List deleted successfully'
  );
}

// SERVICES
class BaseService {
  static generateNextId(data, lastIdKey, entityKey) {
    const nextId = `${entityKey}${1 + Number(data[lastIdKey].slice(1))}`;
    data[lastIdKey] = nextId;
    return nextId;
  }

  static create(entityData, entityName, entityKey) {
    const data = DatabaseService.getData();
    const nextId = this.generateNextId(data, `last${entityName}Id`, entityKey);
    const newEntity = { [`${entityName.toLowerCase()}Id`]: nextId, ...entityData };
    data[`${entityName.toLowerCase()}s`].push(newEntity);
    DatabaseService.setData(data);
    return newEntity;
  }

  static retrieve(id, entityName) {
    const data = DatabaseService.getData();
    return data[`${entityName.toLowerCase()}s`].find(
      (entity) => entity[`${entityName.toLowerCase()}Id`] === id
    );
  }

  static update(id, entityData, entityName) {
    const data = DatabaseService.getData();
    const entities = data[`${entityName.toLowerCase()}s`];
    const entityIndex = entities.findIndex(
      (entity) => entity[`${entityName.toLowerCase()}Id`] === id
    );
    if (entityIndex === -1) throw new Error(`${entityName} not found`);
    entities[entityIndex] = { ...entities[entityIndex], ...entityData };
    DatabaseService.setData(data);
    return entities[entityIndex];
  }

  static delete(id, entityName) {
    const data = DatabaseService.getData();
    data[`${entityName.toLowerCase()}s`] = data[`${entityName.toLowerCase()}s`].filter(
      (entity) => entity[`${entityName.toLowerCase()}Id`] !== id
    );
    DatabaseService.setData(data);
  }
}
class UserService extends BaseService {
  static createUser(userData) {
    const user = super.create(userData, 'User', 'U');
    delete user.password;
    return user;
  }

  static retrieveUser(userId) {
    const user = super.retrieve(userId, 'User');
    if (user) delete user.password;
    return user;
  }

  static updateUser(userId, userData) {
    const user = super.update(userId, userData, 'User');
    delete user.password;
    return user;
  }

  static deleteUser(userId) {
    super.delete(userId, 'User');
  }
}
class ListService extends BaseService {
  static createList(listData) {
    return super.create(listData, 'List', 'L');
  }

  static retrieveList(listId) {
    return super.retrieve(listId, 'List');
  }

  static updateList(listId, listData) {
    return super.update(listId, listData, 'List');
  }

  static deleteList(listId) {
    super.delete(listId, 'List');
  }
}
class TaskService extends BaseService {
  static createTask(taskData) {
    return super.create(taskData, 'Task', 'T');
  }

  static retrieveTask(taskId) {
    return super.retrieve(taskId, 'Task');
  }

  static updateTask(taskId, taskData) {
    return super.update(taskId, taskData, 'Task');
  }

  static deleteTask(taskId) {
    super.delete(taskId, 'Task');
  }

  static completeTask(taskId) {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;
    DatabaseService.setData(data);
    return data.tasks[taskIndex];
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

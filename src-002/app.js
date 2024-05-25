const express = require('express')
const fs = require('fs')
const path = require('path')

// CONTROLLERS
class BaseController {
  static handleRequest(method, code = 200, message = null) {
    return async (req, res) => {
      try {
        const result = await method(req);
        // if (result === null) return res.status(404).json({ message: 'Route not found' });
        if (message) return res.status(code).json({ message });
        res.status(code).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    };
  }
}
class UserController extends BaseController {
  static createUser = BaseController.handleRequest(
    (req) => UserService.createUser(req.body),
    201
  );

  static retrieveUser = BaseController.handleRequest(
    (req) => UserService.retrieveUser(req.params.id)
  );

  static updateUser = BaseController.handleRequest(
    (req) => UserService.updateUser(req.params.id, req.body)
  );

  static deleteUser = BaseController.handleRequest(
    (req) => UserService.deleteUser(req.params.id),
    200,
    'User deleted successfully'
  );
}
class TaskController extends BaseController {
  static createTask = BaseController.handleRequest(
    (req) => TaskService.createTask(req.body),
    201
  );

  static retrieveTask = BaseController.handleRequest(
    (req) => TaskService.retrieveTask(req.params.id)
  );

  static updateTask = BaseController.handleRequest(
    (req) => TaskService.updateTask(req.params.id, req.body)
  );

  static deleteTask = BaseController.handleRequest(
    (req) => TaskService.deleteTask(req.params.id),
    200,
    'Task deleted successfully'
  );

  static completeTask = BaseController.handleRequest(
    (req) => TaskService.completeTask(req.params.id)
  );
}
class ListController extends BaseController {
  static createList = BaseController.handleRequest(
    (req) => ListService.createList(req.body),
    201
  );

  static retrieveList = BaseController.handleRequest(
    (req) => ListService.retrieveList(req.params.id)
  );

  static updateList = BaseController.handleRequest(
    (req) => ListService.updateList(req.params.id, req.body)
  );

  static deleteList = BaseController.handleRequest(
    (req) => ListService.deleteList(req.params.id),
    200,
    'List deleted successfully'
  );
}

// SERVICES
class BaseService {
  static create(params) {
    const { itemData, collectionName, idPrefix, idKey, lastIdKey } = params;
    const data = DatabaseService.getData();
    const nextId = `${idPrefix}${1 + Number(data[lastIdKey].slice(1))}`;
    const newItem = { [idKey]: nextId, ...itemData };
    data[collectionName].push(newItem);
    data[lastIdKey] = nextId;
    DatabaseService.setData(data);
    return newItem;
  }

  static retrieve(params) {
    const { itemId, collectionName, idKey } = params;
    const data = DatabaseService.getData();
    return data[collectionName].find(item => item[idKey] === itemId);
  }

  static update(params) {
    const { itemId, itemData, collectionName, idKey } = params;
    const data = DatabaseService.getData();
    const itemIndex = data[collectionName].findIndex(item => item[idKey] === itemId);
    if (itemIndex === -1) throw new Error(`${collectionName.slice(0, -1)} not found`);
    data[collectionName][itemIndex] = { ...data[collectionName][itemIndex], ...itemData };
    DatabaseService.setData(data);
    return data[collectionName][itemIndex];
  }

  static delete(params) {
    const { itemId, collectionName, idKey } = params;
    const data = DatabaseService.getData();
    data[collectionName] = data[collectionName].filter(item => item[idKey] !== itemId);
    DatabaseService.setData(data);
  }
}

class UserService extends BaseService {
  static createUser(userData) {
    const newUser = super.create({
      itemData: userData,
      collectionName: 'users',
      idPrefix: 'U',
      idKey: 'userId',
      lastIdKey: 'lastUserId'
    });
    delete newUser.password;
    return newUser;
  }

  static retrieveUser(userId) {
    const user = super.retrieve({
      itemId: userId,
      collectionName: 'users',
      idKey: 'userId'
    });
    if (user) delete user.password;
    return user;
  }

  static updateUser(userId, userData) {
    const user = super.update({
      itemId: userId,
      itemData: userData,
      collectionName: 'users',
      idKey: 'userId'
    });
    delete user.password;
    return user;
  }

  static deleteUser(userId) {
    super.delete({
      itemId: userId,
      collectionName: 'users',
      idKey: 'userId'
    });
  }
}

class ListService extends BaseService {
  static createList(listData) {
    return super.create({
      itemData: listData,
      collectionName: 'lists',
      idPrefix: 'L',
      idKey: 'listId',
      lastIdKey: 'lastListId'
    });
  }

  static retrieveList(listId) {
    return super.retrieve({
      itemId: listId,
      collectionName: 'lists',
      idKey: 'listId'
    });
  }

  static updateList(listId, listData) {
    return super.update({
      itemId: listId,
      itemData: listData,
      collectionName: 'lists',
      idKey: 'listId'
    });
  }

  static deleteList(listId) {
    super.delete({
      itemId: listId,
      collectionName: 'lists',
      idKey: 'listId'
    });
  }
}

class TaskService extends BaseService {
  static createTask(taskData) {
    return super.create({
      itemData: taskData,
      collectionName: 'tasks',
      idPrefix: 'T',
      idKey: 'taskId',
      lastIdKey: 'lastTaskId'
    });
  }

  static retrieveTask(taskId) {
    return super.retrieve({
      itemId: taskId,
      collectionName: 'tasks',
      idKey: 'taskId'
    });
  }

  static updateTask(taskId, taskData) {
    return super.update({
      itemId: taskId,
      itemData: taskData,
      collectionName: 'tasks',
      idKey: 'taskId'
    });
  }

  static deleteTask(taskId) {
    super.delete({
      itemId: taskId,
      collectionName: 'tasks',
      idKey: 'taskId'
    });
  }

  static completeTask(taskId) {
    const data = DatabaseService.getData();
    const taskIndex = data.tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;
    DatabaseService.setData(data);
    return data.tasks[taskIndex];
  }
}



class DatabaseService {
  static #db

  static init(filePath) {
    this.#db = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  }

  static getData() {
    return this.#db
  }

  static setData(data) {
    this.#db = data
  }

  static saveToDisk(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.#db), 'utf8')
  }
}

// DATABASE
const PATH = path.join(__dirname, './db.json')
DatabaseService.init(PATH)

// ROUTER
const app = express()
const router = express.Router()

// MIDDLEWARE
app.use(express.json())
app.use('/', router)
// router.use((req, res, next) => res.status(404).json({ message: 'Route not found' }))

// ROUTES
router.post('/users/register', UserController.createUser)
router.get('/users/user/:id', UserController.retrieveUser)
router.put('/users/user/:id', UserController.updateUser)
router.delete('/users/user/:id', UserController.deleteUser)
router.post('/tasks/create', TaskController.createTask)
router.get('/tasks/task/:id', TaskController.retrieveTask)
router.put('/tasks/task/:id', TaskController.updateTask)
router.delete('/tasks/task/:id', TaskController.deleteTask)
router.patch('/tasks/task/:id/complete', TaskController.completeTask)
router.post('/lists/create', ListController.createList)
router.get('/lists/list/:id', ListController.retrieveList)
router.put('/lists/list/:id', ListController.updateList)
router.delete('/lists/list/:id', ListController.deleteList)

// SERVER
const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))

const express = require('express')
const fs = require('fs')
const path = require('path')

// CONTROLLERS
class BaseController {
  static handleRequest(serviceMethod, successStatusCode = 200) {
    return async (req, res) => {
      try {
        const result = await serviceMethod(req);
        if (result === null) {
          return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(successStatusCode).json(result);
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
    200
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
    200
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
    200
  );
}


// SERVICES
class UserService {
  static createUser(userData) {
    const data = DatabaseService.getData()
    const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`
    const newUser = { userId: nextUserId, ...userData }
    data.users.push(newUser)
    data.lastUserId = nextUserId
    DatabaseService.setData(data)
    delete newUser.password
    return newUser
  }
  static retrieveUser(userId) {
    const data = DatabaseService.getData()
    const user = data.users.find((user) => user.userId === userId)
    delete user.password
    return user
  }
  static updateUser(userId, userData) {
    const data = DatabaseService.getData()
    const userIndex = data.users.findIndex((user) => user.userId === userId)
    if (userIndex === -1) throw new Error('User not found')
    data.users[userIndex] = { ...data.users[userIndex], ...userData }
    DatabaseService.setData(data)
    const user = data.users[userIndex]
    delete user.password
    return user
  }
  static deleteUser(userId) {
    const data = DatabaseService.getData()
    data.users = data.users.filter((user) => user.userId !== userId)
    DatabaseService.setData(data)
  }
}
class ListService {
  static createList(listData) {
    const data = DatabaseService.getData()
    const nextListId = `L${1 + Number(data.lastListId.slice(1))}`
    const newList = { listId: nextListId, ...listData }
    data.lists.push(newList)
    data.lastListId = nextListId
    DatabaseService.setData(data)
    return newList
  }
  static retrieveList(listId) {
    const data = DatabaseService.getData()
    return data.lists.find((list) => list.listId === listId)
  }
  static updateList(listId, listData) {
    const data = DatabaseService.getData()
    const listIndex = data.lists.findIndex((list) => list.listId === listId)
    if (listIndex === -1) throw new Error('List not found')
    data.lists[listIndex] = { ...data.lists[listIndex], ...listData }
    DatabaseService.setData(data)
    return data.lists[listIndex]
  }
  static deleteList(listId) {
    const data = DatabaseService.getData()
    data.lists = data.lists.filter((list) => list.listId !== listId)
    DatabaseService.setData(data)
  }
}
class TaskService {
  static createTask(taskData) {
    const data = DatabaseService.getData()
    const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`
    const newTask = { taskId: nextTaskId, ...taskData }
    data.tasks.push(newTask)
    data.lastTaskId = nextTaskId
    DatabaseService.setData(data)
    return newTask
  }
  static retrieveTask(taskId) {
    const data = DatabaseService.getData()
    return data.tasks.find((task) => task.taskId === taskId)
  }
  static updateTask(taskId, taskData) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData }
    DatabaseService.setData(data)
    return data.tasks[taskIndex]
  }
  static deleteTask(taskId) {
    const data = DatabaseService.getData()
    data.tasks = data.tasks.filter((task) => task.taskId !== taskId)
    DatabaseService.setData(data)
  }
  static completeTask(taskId) {
    const data = DatabaseService.getData()
    const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    data.tasks[taskIndex].isComplete = true
    DatabaseService.setData(data)
    return data.tasks[taskIndex]
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

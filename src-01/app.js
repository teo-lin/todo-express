const express = require('express')
const fs = require('fs')
const path = require('path')
const PATH = path.join(__dirname, './db.json')

// ROUTING FUNCTIONS
async function createUser(req, res) {
  try {
    const newUser = await userService_createUser(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function retrieveUser(req, res) {
  try {
    const user = await userService_retrieveUser(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function updateUser(req, res) {
  try {
    const updatedUser = await userService_updateUser(req.params.id, req.body)
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function deleteUser(req, res) {
  try {
    await userService_deleteUser(req.params.id)
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function createTask(req, res) {
  try {
    const newTask = await taskService_createTask(req.body)
    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function retrieveTask(req, res) {
  try {
    const task = await taskService_retrieveTask(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function updateTask(req, res) {
  try {
    const updatedTask = await taskService_updateTask(req.params.id, req.body)
    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function deleteTask(req, res) {
  try {
    await taskService_deleteTask(req.params.id)
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function completeTask(req, res) {
  try {
    const taskId = req.params.id
    const task = await taskService_completeTask(taskId)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function createList(req, res) {
  try {
    const newList = await listService_createList(req.body)
    res.status(201).json(newList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function retrieveList(req, res) {
  try {
    const list = await listService_retrieveList(req.params.id)
    if (!list) return res.status(404).json({ message: 'List not found' })
    res.json(list)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function updateList(req, res) {
  try {
    const updatedList = await listService_updateList(req.params.id, req.body)
    res.json(updatedList)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
async function deleteList(req, res) {
  try {
    await listService_deleteList(req.params.id)
    res.json({ message: 'List deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// SERVICES
async function userService_createUser(userData) {
  const data = db_getData(PATH)
  const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`
  const newUser = { userId: nextUserId, ...userData }
  data.users.push(newUser)
  data.lastUserId = nextUserId
  db_setData(PATH, data)
  delete newUser.password
  return newUser
}
async function userService_retrieveUser(userId) {
  const data = db_getData(PATH)
  const user = data.users.find((user) => user.userId === userId)
  delete user.password
  return user
}
async function userService_updateUser(userId, userData) {
  const data = db_getData(PATH)
  const userIndex = data.users.findIndex((user) => user.userId === userId)
  if (userIndex === -1) throw new Error('User not found')
  data.users[userIndex] = { ...data.users[userIndex], ...userData }
  db_setData(PATH, data)
  const user = data.users[userIndex]
  delete user.password
  return user
}
async function userService_deleteUser(userId) {
  const data = db_getData(PATH)
  data.users = data.users.filter((user) => user.userId !== userId)
  db_setData(PATH, data)
}
async function listService_createList(listData) {
  const data = db_getData(PATH)
  const nextListId = `L${1 + Number(data.lastListId.slice(1))}`
  const newList = { listId: nextListId, ...listData }
  data.lists.push(newList)
  data.lastListId = nextListId
  db_setData(PATH, data)
  return newList
}
async function listService_retrieveList(listId) {
  const data = db_getData(PATH)
  return data.lists.find((list) => list.listId === listId)
}
async function listService_updateList(listId, listData) {
  const data = db_getData(PATH)
  const listIndex = data.lists.findIndex((list) => list.listId === listId)
  if (listIndex === -1) throw new Error('List not found')
  data.lists[listIndex] = { ...data.lists[listIndex], ...listData }
  db_setData(PATH, data)
  return data.lists[listIndex]
}
async function listService_deleteList(listId) {
  const data = db_getData(PATH)
  data.lists = data.lists.filter((list) => list.listId !== listId)
  db_setData(PATH, data)
}
async function taskService_createTask(taskData) {
  const data = db_getData(PATH)
  const nextTaskId = `T${1 + Number(data.lastTaskId.slice(1))}`
  const newTask = { taskId: nextTaskId, ...taskData }
  data.tasks.push(newTask)
  data.lastTaskId = nextTaskId
  db_setData(PATH, data)
  return newTask
}
async function taskService_retrieveTask(taskId) {
  const data = db_getData(PATH)
  return data.tasks.find((task) => task.taskId === taskId)
}
async function taskService_updateTask(taskId, taskData) {
  const data = db_getData(PATH)
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
  if (taskIndex === -1) throw new Error('Task not found')
  data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...taskData }
  db_setData(PATH, data)
  return data.tasks[taskIndex]
}
async function taskService_deleteTask(taskId) {
  const data = db_getData(PATH)
  data.tasks = data.tasks.filter((task) => task.taskId !== taskId)
  db_setData(PATH, data)
}
async function taskService_completeTask(taskId) {
  const data = db_getData(PATH)
  const taskIndex = data.tasks.findIndex((task) => task.taskId === taskId)
  if (taskIndex === -1) throw new Error('Task not found')
  data.tasks[taskIndex].isComplete = true
  db_setData(PATH, data)
  return data.tasks[taskIndex]
}
function db_getData(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
function db_setData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
}

// DATABASE - onDisk

// ROUTER
const app = express()
const router = express.Router()

// MIDDLEWARE
app.use(express.json())
app.use('/', router)

// ROUTES
router.post('/users/register', createUser)
router.get('/users/user/:id', retrieveUser)
router.put('/users/user/:id', updateUser)
router.delete('/users/user/:id', deleteUser)
router.post('/tasks/create', createTask)
router.get('/tasks/task/:id', retrieveTask)
router.put('/tasks/task/:id', updateTask)
router.delete('/tasks/task/:id', deleteTask)
router.patch('/tasks/task/:id/complete', completeTask)
router.post('/lists/create', createList)
router.get('/lists/list/:id', retrieveList)
router.put('/lists/list/:id', updateList)
router.delete('/lists/list/:id', deleteList)

// SERVER
const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))

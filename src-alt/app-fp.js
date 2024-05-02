const express = require('express')
const fs = require('fs')
const path = require('path')

const PATH_USERS = path.join(__dirname, './users.json')
const PATH_TASKS = path.join(__dirname, './tasks.json')
const PATH_LISTS = path.join(__dirname, './lists.json')
const PORT = 3333

// ROUTING FUNCTIONS
async function createUser(req, res) {
	try {
		const newUser = await usersService_createUser(req.body)
		res.status(201).json(newUser)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function retrieveUser(req, res) {
	try {
		const user = await usersService_retrieveUser(req.params.id)
		if (!user) return res.status(404).json({ message: 'User not found' })
		res.json(user)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function updateUser(req, res) {
	try {
		const updatedUser = await usersService_updateUser(req.params.id, req.body)
		res.json(updatedUser)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function deleteUser(req, res) {
	try {
		await usersService_deleteUser(req.params.id)
		res.json({ message: 'User deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function createTask(req, res) {
	try {
		const newTask = await tasksService_createTask(req.body)
		res.status(201).json(newTask)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function retrieveTask(req, res) {
	try {
		const task = await tasksService_retrieveTask(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })
		res.json(task)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function updateTask(req, res) {
	try {
		const updatedTask = await tasksService_updateTask(req.params.id, req.body)
		res.json(updatedTask)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function deleteTask(req, res) {
	try {
		await tasksService_deleteTask(req.params.id)
		res.json({ message: 'Task deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function completeTask(req, res) {
	try {
		const taskId = req.params.id
		const task = await tasksService_completeTask(taskId)
		if (!task) return res.status(404).json({ message: 'Task not found' })
		res.json(task)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function createList(req, res) {
	try {
		const newList = await listsService_createList(req.body)
		res.status(201).json(newList)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function retrieveList(req, res) {
	try {
		const list = await listsService_retrieveList(req.params.id)
		if (!list) return res.status(404).json({ message: 'List not found' })
		res.json(list)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function updateList(req, res) {
	try {
		const updatedList = await listsService_updateList(req.params.id, req.body)
		res.json(updatedList)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function deleteList(req, res) {
	try {
		await listsService_deleteList(req.params.id)
		res.json({ message: 'List deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

// SERVICES
async function usersService_createUser(userData) {
	const usersData = db_getData(PATH_USERS)
	const nextUserId = `U${1 + Number(usersData.lastUserId.slice(1))}`
	const newUser = { userId: nextUserId, ...userData }
	usersData.users.push(newUser)
	usersData.lastUserId = nextUserId
	db_setData(PATH_USERS, usersData)
	delete newUser.passWord
	return newUser
}
async function usersService_retrieveUser(userId) {
	const usersData = db_getData(PATH_USERS)
	const user = usersData.users.find((user) => user.userId === userId)
	delete user.passWord
	return user
}
async function usersService_updateUser(userId, userData) {
	const usersData = db_getData(PATH_USERS)
	const userIndex = usersData.users.findIndex((user) => user.userId === userId)
	if (userIndex === -1) throw new Error('User not found')
	usersData.users[userIndex] = { ...usersData.users[userIndex], ...userData }
	db_setData(PATH_USERS, usersData)
	const user = usersData.users[userIndex]
	delete user.passWord
	return user
}
async function usersService_deleteUser(userId) {
	const usersData = db_getData(PATH_USERS)
	usersData.users = usersData.users.filter((user) => user.userId !== userId)
	db_setData(PATH_USERS, usersData)
}
async function listsService_createList(listData) {
	const listsData = db_getData(PATH_LISTS)
	const nextListId = `L${1 + Number(listsData.lastListId.slice(1))}`
	const newList = { listId: nextListId, ...listData }
	listsData.lists.push(newList)
	listsData.lastListId = nextListId
	db_setData(PATH_LISTS, listsData)
	return newList
}
async function listsService_retrieveList(listId) {
	const listsData = db_getData(PATH_LISTS)
	return listsData.lists.find((list) => list.listId === listId)
}
async function listsService_updateList(listId, listData) {
	const listsData = db_getData(PATH_LISTS)
	const listIndex = listsData.lists.findIndex((list) => list.listId === listId)
	if (listIndex === -1) throw new Error('List not found')
	listsData.lists[listIndex] = { ...listsData.lists[listIndex], ...listData }
	db_setData(PATH_LISTS, listsData)
	return listsData.lists[listIndex]
}
async function listsService_deleteList(listId) {
	const listsData = db_getData(PATH_LISTS)
	listsData.lists = listsData.lists.filter((list) => list.listId !== listId)
	db_setData(PATH_LISTS, listsData)
}
async function tasksService_createTask(taskData) {
	const tasksData = db_getData(PATH_TASKS)
	const nextTaskId = `T${1 + Number(tasksData.lastTaskId.slice(1))}`
	const newTask = { taskId: nextTaskId, ...taskData }
	tasksData.tasks.push(newTask)
	tasksData.lastTaskId = nextTaskId
	db_setData(PATH_TASKS, tasksData)
	return newTask
}
async function tasksService_retrieveTask(taskId) {
	const tasksData = db_getData(PATH_TASKS)
	return tasksData.tasks.find((task) => task.taskId === taskId)
}
async function tasksService_updateTask(taskId, taskData) {
	const tasksData = db_getData(PATH_TASKS)
	const taskIndex = tasksData.tasks.findIndex((task) => task.taskId === taskId)
	if (taskIndex === -1) throw new Error('Task not found')
	tasksData.tasks[taskIndex] = { ...tasksData.tasks[taskIndex], ...taskData }
	db_setData(PATH_TASKS, tasksData)
	return tasksData.tasks[taskIndex]
}
async function tasksService_deleteTask(taskId) {
	const tasksData = db_getData(PATH_TASKS)
	tasksData.tasks = tasksData.tasks.filter((task) => task.taskId !== taskId)
	db_setData(PATH_TASKS, tasksData)
}
async function tasksService_completeTask(taskId) {
	const tasksData = db_getData(PATH_TASKS)
	const taskIndex = tasksData.tasks.findIndex((task) => task.taskId === taskId)
	if (taskIndex === -1) throw new Error('Task not found')
	tasksData.tasks[taskIndex].isComplete = true
	db_setData(PATH_TASKS, tasksData)
	return tasksData.tasks[taskIndex]
}
function db_getData(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
function db_setData(filePath, data) {
	fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
}

// ROUTER
const app = express();
const router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/', router);

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
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
)

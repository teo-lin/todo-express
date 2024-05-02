const express = require('express')
const fs = require('fs')
const path = require('path')

const PATH_USERS = path.join(__dirname, './users.json')
const PATH_TASKS = path.join(__dirname, './tasks.json')
const PATH_LISTS = path.join(__dirname, './lists.json')
const PORT = 3333

// CONTROLLERS
class UserController {
	static async createUser(req, res) {
		try {
			const newUser = await UserService.createUser(req.body)
			res.status(201).json(newUser)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async retrieveUser(req, res) {
		try {
			const user = await UserService.retrieveUser(req.params.id)
			if (!user) return res.status(404).json({ message: 'User not found' })
			res.json(user)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async updateUser(req, res) {
		try {
			const updatedUser = await UserService.updateUser(req.params.id, req.body)
			res.json(updatedUser)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async deleteUser(req, res) {
		try {
			await UserService.deleteUser(req.params.id)
			res.json({ message: 'User deleted successfully' })
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
}
class TaskController {
	static async createTask(req, res) {
		try {
			const newTask = await TaskService.createTask(req.body)
			res.status(201).json(newTask)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async retrieveTask(req, res) {
		try {
			const task = await TaskService.retrieveTask(req.params.id)
			if (!task) return res.status(404).json({ message: 'Task not found' })
			res.json(task)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async updateTask(req, res) {
		try {
			const updatedTask = await TaskService.updateTask(req.params.id, req.body)
			res.json(updatedTask)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async deleteTask(req, res) {
		try {
			await TaskService.deleteTask(req.params.id)
			res.json({ message: 'Task deleted successfully' })
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async completeTask(req, res) {
		try {
			const taskId = req.params.id
			const task = await TaskService.completeTask(taskId)
			if (!task) return res.status(404).json({ message: 'Task not found' })
			res.json(task)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
}
class ListController {
	static async createList(req, res) {
		try {
			const newList = await ListService.createList(req.body)
			res.status(201).json(newList)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async retrieveList(req, res) {
		try {
			const list = await ListService.retrieveList(req.params.id)
			if (!list) return res.status(404).json({ message: 'List not found' })
			res.json(list)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async updateList(req, res) {
		try {
			const updatedList = await ListService.updateList(req.params.id, req.body)
			res.json(updatedList)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
	static async deleteList(req, res) {
		try {
			await ListService.deleteList(req.params.id)
			res.json({ message: 'List deleted successfully' })
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
}

// SERVICES
class UserService {
	static async createUser(userData) {
		const usersData = DatabaseService.getData(PATH_USERS)
		const nextUserId = `U${1 + Number(usersData.lastUserId.slice(1))}`
		const newUser = { userId: nextUserId, ...userData }
		usersData.users.push(newUser)
		usersData.lastUserId = nextUserId
		DatabaseService.setData(PATH_USERS, usersData)
		delete newUser.passWord
		return newUser
	}
	static async retrieveUser(userId) {
		const usersData = DatabaseService.getData(PATH_USERS)
		const user = usersData.users.find((user) => user.userId === userId)
		delete user.passWord
		return user
	}
	static async updateUser(userId, userData) {
		const usersData = DatabaseService.getData(PATH_USERS)
		const userIndex = usersData.users.findIndex(
			(user) => user.userId === userId
		)
		if (userIndex === -1) throw new Error('User not found')
		usersData.users[userIndex] = { ...usersData.users[userIndex], ...userData }
		DatabaseService.setData(PATH_USERS, usersData)
		const user = usersData.users[userIndex]
		delete user.passWord
		return user
	}
	static async deleteUser(userId) {
		const usersData = DatabaseService.getData(PATH_USERS)
		usersData.users = usersData.users.filter((user) => user.userId !== userId)
		DatabaseService.setData(PATH_USERS, usersData)
	}
}
class ListService {
	static async createList(listData) {
		const listsData = DatabaseService.getData(PATH_LISTS)
		const nextListId = `L${1 + Number(listsData.lastListId.slice(1))}`
		const newList = { listId: nextListId, ...listData }
		listsData.lists.push(newList)
		listsData.lastListId = nextListId
		DatabaseService.setData(PATH_LISTS, listsData)
		return newList
	}
	static async retrieveList(listId) {
		const listsData = DatabaseService.getData(PATH_LISTS)
		return listsData.lists.find((list) => list.listId === listId)
	}
	static async updateList(listId, listData) {
		const listsData = DatabaseService.getData(PATH_LISTS)
		const listIndex = listsData.lists.findIndex(
			(list) => list.listId === listId
		)
		if (listIndex === -1) throw new Error('List not found')
		listsData.lists[listIndex] = { ...listsData.lists[listIndex], ...listData }
		DatabaseService.setData(PATH_LISTS, listsData)
		return listsData.lists[listIndex]
	}
	static async deleteList(listId) {
		const listsData = DatabaseService.getData(PATH_LISTS)
		listsData.lists = listsData.lists.filter((list) => list.listId !== listId)
		DatabaseService.setData(PATH_LISTS, listsData)
	}
}
class TaskService {
	static async createTask(taskData) {
		const tasksData = DatabaseService.getData(PATH_TASKS)
		const nextTaskId = `T${1 + Number(tasksData.lastTaskId.slice(1))}`
		const newTask = { taskId: nextTaskId, ...taskData }
		tasksData.tasks.push(newTask)
		tasksData.lastTaskId = nextTaskId
		DatabaseService.setData(PATH_TASKS, tasksData)
		return newTask
	}
	static async retrieveTask(taskId) {
		const tasksData = DatabaseService.getData(PATH_TASKS)
		return tasksData.tasks.find((task) => task.taskId === taskId)
	}
	static async updateTask(taskId, taskData) {
		const tasksData = DatabaseService.getData(PATH_TASKS)
		const taskIndex = tasksData.tasks.findIndex(
			(task) => task.taskId === taskId
		)
		if (taskIndex === -1) throw new Error('Task not found')
		tasksData.tasks[taskIndex] = { ...tasksData.tasks[taskIndex], ...taskData }
		DatabaseService.setData(PATH_TASKS, tasksData)
		return tasksData.tasks[taskIndex]
	}
	static async deleteTask(taskId) {
		const tasksData = DatabaseService.getData(PATH_TASKS)
		tasksData.tasks = tasksData.tasks.filter((task) => task.taskId !== taskId)
		DatabaseService.setData(PATH_TASKS, tasksData)
	}
	static async completeTask(taskId) {
		const tasksData = DatabaseService.getData(PATH_TASKS)
		const taskIndex = tasksData.tasks.findIndex(
			(task) => task.taskId === taskId
		)
		if (taskIndex === -1) throw new Error('Task not found')
		tasksData.tasks[taskIndex].isComplete = true
		DatabaseService.setData(PATH_TASKS, tasksData)
		return tasksData.tasks[taskIndex]
	}
}
class DatabaseService {
	static getData(filePath) {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'))
	}
	static setData(filePath, data) {
		fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
	}
}

// ROUTER
const app = express()
const router = express.Router()

// MIDDLEWARE
app.use(express.json())
app.use('/', router)

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
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
)

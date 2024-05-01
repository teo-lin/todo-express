const path = require('path')
const db = require('../database/database.service')
const PATH = path.join(__dirname, '../database/tasks.json')

async function createTask(taskData) {
	const tasksData = db.getData(PATH)
	const nextTaskId = `T${1 + Number(tasksData.lastTaskId.slice(1))}`
	const newTask = { id: nextTaskId, ...taskData }
	tasksData.tasks.push(newTask)
	tasksData.lastTaskId = nextTaskId
	db.setData(PATH, tasksData)
	return newTask
}

async function retrieveTask(taskId) {
	const tasksData = db.getData(PATH)
	return tasksData.tasks.find((task) => task.taskId === taskId)
}

async function updateTask(taskId, taskData) {
	const tasksData = db.getData(PATH)
	const taskIndex = tasksData.tasks.findIndex((task) => task.taskId === taskId)
	if (taskIndex === -1) throw new Error('Task not found')
	tasksData.tasks[taskIndex] = { ...tasksData.tasks[taskIndex], ...taskData }
	db.setData(PATH, tasksData)
	return tasksData.tasks[taskIndex]
}

async function deleteTask(taskId) {
	const tasksData = db.getData(PATH)
	tasksData.tasks = tasksData.tasks.filter((task) => task.taskId !== taskId)
	db.setData(PATH, tasksData)
}

async function completeTask(taskId) {
	const tasksData = db.getData(PATH)
	const taskIndex = tasksData.tasks.findIndex((task) => task.taskId === taskId)
	if (taskIndex === -1) throw new Error('Task not found')
	tasksData.tasks[taskIndex].isComplete = true
	db.setData(PATH, tasksData)
	return tasksData.tasks[taskIndex]
}

module.exports = { createTask, retrieveTask, updateTask, deleteTask, completeTask }

const express = require('express')
const router = express.Router()
const tasksService = require('./tasks.service')

router.post('/create', createTask)
router.get('/task/:id', retrieveTask)
router.put('/task/:id', updateTask)
router.delete('/task/:id', deleteTask)
router.patch('/task/:id/complete', completeTask)

async function createTask(req, res) {
	try {
		const newTask = await tasksService.createTask(req.body)
		res.status(201).json(newTask)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function retrieveTask(req, res) {
	try {
		const task = await tasksService.retrieveTask(req.params.id)
		if (!task) return res.status(404).json({ message: 'Task not found' })
		res.json(task)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function updateTask(req, res) {
	try {
		const updatedTask = await tasksService.updateTask(req.params.id, req.body)
		res.json(updatedTask)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function deleteTask(req, res) {
	try {
		await tasksService.deleteTask(req.params.id)
		res.json({ message: 'Task deleted successfully' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}
async function completeTask(req, res) {
	try {
		const taskId = req.params.id
		const task = await tasksService.completeTask(taskId)
		if (!task) return res.status(404).json({ message: 'Task not found' })
		res.json(task)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

module.exports = router

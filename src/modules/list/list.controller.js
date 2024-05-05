const express = require('express')
const ListService = require('./list.service')

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

const listRouter = express.Router()
listRouter.post('/create', ListController.createList)
listRouter.get('/list/:id', ListController.retrieveList)
listRouter.put('/list/:id', ListController.updateList)
listRouter.delete('/list/:id', ListController.deleteList)

module.exports = listRouter

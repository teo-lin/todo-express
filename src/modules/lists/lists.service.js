const path = require('path')
const db = require('../database/database.service')
const PATH = path.join(__dirname, '../database/lists.json')

async function createList(listData) {
	const listsData = db.getData(PATH)
	const nextListId = `L${1 + Number(listsData.lastListId.slice(1))}`
	const newList = { listId: nextListId, ...listData }
	listsData.lists.push(newList)
	listsData.lastListId = nextListId
	db.setData(PATH, listsData)
	return newList
}

async function retrieveList(listId) {
	const listsData = db.getData(PATH)
	return listsData.lists.find((list) => list.listId === listId)
}

async function updateList(listId, listData) {
	const listsData = db.getData(PATH)
	const listIndex = listsData.lists.findIndex((list) => list.listId === listId)
	if (listIndex === -1) throw new Error('List not found')
	listsData.lists[listIndex] = { ...listsData.lists[listIndex], ...listData }
	db.setData(PATH, listsData)
	return listsData.lists[listIndex]
}

async function deleteList(listId) {
	const listsData = db.getData(PATH)
	listsData.lists = listsData.lists.filter((list) => list.listId !== listId)
	db.setData(PATH, listsData)
}

module.exports = { createList, retrieveList, updateList, deleteList }

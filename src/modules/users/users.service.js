const path = require('path')
const db = require('../database/database.service')
const PATH = path.join(__dirname, '../database/users.json')

async function createUser(userData) {
	const usersData = db.getData(PATH)
	const nextUserId = `U${1 + Number(usersData.lastUserId.slice(1))}`
	const newUser = { id: nextUserId, ...userData }
	usersData.users.push(newUser)
	usersData.lastUserId = nextUserId
	db.setData(PATH, usersData)
	delete newUser.passWord
	return newUser
}

async function retrieveUser(userId) {
	const usersData = db.getData(PATH)
	const user = usersData.users.find((user) => user.userId === userId)
	delete user.passWord
	return user
}

async function updateUser(userId, userData) {
	const usersData = db.getData(PATH)
	const userIndex = usersData.users.findIndex((user) => user.userId === userId)
	if (userIndex === -1) throw new Error('User not found')
	usersData.users[userIndex] = { ...usersData.users[userIndex], ...userData }
	db.setData(PATH, usersData)
	const user = usersData.users[userIndex]
  delete user.passWord
  return user
}

async function deleteUser(userId) {
	const usersData = db.getData(PATH)
	usersData.users = usersData.users.filter((user) => user.userId !== userId)
	db.setData(PATH, usersData)
}

module.exports = { createUser, retrieveUser, updateUser, deleteUser }

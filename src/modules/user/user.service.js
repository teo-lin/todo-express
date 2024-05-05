const DatabaseService = require('../database/database.service')

class UserService {
	static async createUser(userData) {
		const data = DatabaseService.getData()
		const nextUserId = `U${1 + Number(data.lastUserId.slice(1))}`
		const newUser = { userId: nextUserId, ...userData }
		data.users.push(newUser)
		data.lastUserId = nextUserId
		DatabaseService.setData(data)
		delete newUser.password
		return newUser
	}
	static async retrieveUser(userId) {
		const data = DatabaseService.getData()
		const user = data.users.find((user) => user.userId === userId)
		delete user.password
		return user
	}
	static async updateUser(userId, userData) {
		const data = DatabaseService.getData()
		const userIndex = data.users.findIndex((user) => user.userId === userId)
		if (userIndex === -1) throw new Error('User not found')
		data.users[userIndex] = { ...data.users[userIndex], ...userData }
		DatabaseService.setData(data)
		const user = data.users[userIndex]
		delete user.password
		return user
	}
	static async deleteUser(userId) {
		const data = DatabaseService.getData()
		data.users = data.users.filter((user) => user.userId !== userId)
		DatabaseService.setData(data)
	}
}

module.exports = UserService

const fs = require('fs')
const path = require('path')

class DatabaseService {
	static #db
	static #PATH = path.join(process.cwd(), './src/modules/database/db.json')

	static init() {
		this.#db = JSON.parse(fs.readFileSync(this.#PATH, 'utf8'))
	}

	static getData() {
		return this.#db
	}

	static setData(data) {
		this.#db = data
	}

	static save() {
		fs.writeFileSync(this.#PATH, JSON.stringify(this.#db), 'utf8')
	}
}

module.exports = DatabaseService

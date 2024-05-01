const fs = require('fs')

function getData(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function setData(filePath, data) {
	fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
}

module.exports = { getData, setData }

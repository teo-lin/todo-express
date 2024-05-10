const fs = require('fs')
const path = require('path')
const PATH = path.join(__dirname, './db.json')

function getData() {
  return JSON.parse(fs.readFileSync(PATH, 'utf8'))
}

function setData(data) {
  fs.writeFileSync(PATH, JSON.stringify(data), 'utf8')
}

module.exports = { getData, setData }

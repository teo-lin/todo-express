const fs = require('fs');
const path = require('path');

const PATH = path.join(__dirname, './db.json');
const data = JSON.parse(fs.readFileSync(PATH, 'utf8'));

module.exports = data

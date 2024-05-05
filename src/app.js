const express = require('express')
const userRouter = require('./modules/user/user.controller')
const taskRouter = require('./modules/task/task.controller')
const listRouter = require('./modules/list/list.controller')
const DatabaseService = require('./modules/database/database.service')

// ROUTER
const app = express()
const PORT = 3333

// MIDDLEWARE
app.use(express.json())
app.use('/users', userRouter)
app.use('/tasks', taskRouter)
app.use('/lists', listRouter)

// SERVER
DatabaseService.init()
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`)
)

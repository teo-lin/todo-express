const express = require('express')
const usersRouter = require('./modules/user/user.controller')
const tasksRouter = require('./modules/task/task.controller')
const listsRouter = require('./modules/list/list.controller')

const app = express()
const PORT = 3333

app.use(express.json())

app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)
app.use('/lists', listsRouter)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))

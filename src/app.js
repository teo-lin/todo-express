const express = require('express')
const usersRouter = require('./modules/users/users.controller')
const tasksRouter = require('./modules/tasks/tasks.controller')
const listsRouter = require('./modules/lists/lists.controller')

const app = express()
const PORT = 3333

app.use(express.json())

app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)
app.use('/lists', listsRouter)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))

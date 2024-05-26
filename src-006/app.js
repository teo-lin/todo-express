const express = require('express');
const usersRouter = require('./modules/user/user.controller');
const tasksRouter = require('./modules/task/task.controller');
const listsRouter = require('./modules/list/list.controller');

// DATABASE - onDisk

// ROUTER
const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/lists', listsRouter);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

const express = require('express');
const userRouter = require('./modules/user/user.controller');
const taskRouter = require('./modules/task/task.controller');
const listRouter = require('./modules/list/list.controller');
const DatabaseService = require('./modules/database/database.service');

// DATABASE
DatabaseService.init();

// ROUTER
const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/lists', listRouter);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
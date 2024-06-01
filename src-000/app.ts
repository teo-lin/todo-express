import express from 'express';
import userRouter from './modules/user/user.controller';
import taskRouter from './modules/task/task.controller';
import listRouter from './modules/list/list.controller';
import { DatabaseService } from './modules/database/database.service';

// DATABASE
DatabaseService.init();

// ROUTER
const app = express();
const router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
app.use('/users', userRouter);
app.use('/tasks', taskRouter);
app.use('/lists', listRouter);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

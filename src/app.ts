import express, { Express, Router } from 'express';
import userRouter from './modules/user/user.controller';
import taskRouter from './modules/task/task.controller';
import listRouter from './modules/list/list.controller';
import DatabaseService from './modules/database/database.service';

const startTime = process.hrtime();

// DATABASE
DatabaseService.init();

// ROUTER
const app: Express = express();
const router: Router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
router.use('/users', userRouter);
router.use('/tasks', taskRouter);
router.use('/lists', listRouter);
router.get('/', (req, res) => res.send('Hello World!'));

// SERVER
const PORT = 3000;
const endTime = process.hrtime(startTime);
const startupTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3);
app.listen(PORT, () =>
  console.log(`Server started in ${startupTime} ms on http://localhost:${PORT}`)
);

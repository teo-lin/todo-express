import express, { Express, Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// INTERFACES
interface Database {
  lastUserId: string;
  lastListId: string;
  lastTaskId: string;
  users: User[];
  lists: List[];
  tasks: Task[];
}
interface User {
  userId: string;
  username: string;
  password: string;
  fullname: string;
}
interface List {
  listId: string;
  listName: string;
  isShared: boolean;
}
interface Task {
  taskId: string;
  listId: string;
  userId: string;
  taskName: string;
  isComplete: boolean;
}
interface NewUser extends Omit<User, 'userId'> {}
interface MaskedUser extends Omit<User, 'password'> {}
interface NewList extends Omit<List, 'listId'> {}
interface NewTask extends Omit<Task, 'taskId'> {}

// CONTROLLERS
class UserController {
  static createUser(req: Request, res: Response): void {
    try {
      const user: MaskedUser = UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveUser(req: Request, res: Response): void {
    try {
      const user: MaskedUser | undefined = UserService.retrieveUser(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static updateUser(req: Request, res: Response): void {
    try {
      const user: MaskedUser = UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static deleteUser(req: Request, res: Response): void {
    try {
      UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'User not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}
class TaskController {
  static createTask(req: Request, res: Response): void {
    try {
      const task: Task = TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveTask(req: Request, res: Response): void {
    try {
      const task: Task | undefined = TaskService.retrieveTask(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static updateTask(req: Request, res: Response): void {
    try {
      const task: Task = TaskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static deleteTask(req: Request, res: Response): void {
    try {
      TaskService.deleteTask(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static completeTask(req: Request, res: Response): void {
    try {
      const task: Task = TaskService.completeTask(req.params.id);
      res.json(task);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'Task not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}
class ListController {
  static createList(req: Request, res: Response): void {
    try {
      const list: List = ListService.createList(req.body);
      res.status(201).json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveList(req: Request, res: Response): void {
    try {
      const list: List | undefined = ListService.retrieveList(req.params.id);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static updateList(req: Request, res: Response): void {
    try {
      const list: List = ListService.updateList(req.params.id, req.body);
      res.json(list);
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }

  static deleteList(req: Request, res: Response): void {
    try {
      ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      if (error.message === 'Not Found') res.status(404).json({ message: 'List not found' });
      else res.status(500).json({ message: error.message });
    }
  }
}

// SERVICES
class UserService {
  static createUser(userData: NewUser): MaskedUser {
    const data: Database = DatabaseService.getData();
    const nextUserId: string = `U${1 + Number(data.lastUserId.slice(1))}`;
    const user: User = { userId: nextUserId, ...userData };

    data.users.push(user);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static retrieveUser(userId: string): MaskedUser | undefined {
    const data: Database = DatabaseService.getData();
    const user: User | undefined = data.users.find((user: User) => user.userId === userId);

    if (!user) throw new Error('Not Found');
    else {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId: string, userData: Partial<User>): MaskedUser {
    const data: Database = DatabaseService.getData();
    const userIndex: number = data.users.findIndex((user: User) => user.userId === userId);
    if (userIndex === -1) throw new Error('Not Found');
    const user: User = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = user;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = user;
    return maskedUser;
  }

  static deleteUser(userId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.users.length;

    data.users = data.users.filter((user: User) => user.userId !== userId);
    if (totalRecords === data.users.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}
class TaskService {
  static createTask(taskData: NewTask): Task {
    const data: Database = DatabaseService.getData();
    const nextTaskId: string = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const task: Task = { taskId: nextTaskId, ...taskData };

    data.tasks.push(task);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return task;
  }

  static retrieveTask(taskId: string): Task | undefined {
    const data: Database = DatabaseService.getData();

    const task: Task | undefined = data.tasks.find((task: Task) => task.taskId === taskId);
    if (!task) throw new Error('Not Found');
    else return task;
  }

  static updateTask(taskId: string, taskData: Partial<Task>): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Not Found');
    const task: Task = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = task;
    DatabaseService.setData(data);

    return task;
  }

  static deleteTask(taskId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.tasks.length;

    data.tasks = data.tasks.filter((task: Task) => task.taskId !== taskId);
    if (totalRecords === data.tasks.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }

  static completeTask(taskId: string): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: Task) => task.taskId === taskId);

    if (taskIndex === -1) throw new Error('Not Found');
    else {
      data.tasks[taskIndex].isComplete = true;
      DatabaseService.setData(data);
      return data.tasks[taskIndex];
    }
  }
}
class ListService {
  static createList(listData: NewList): List {
    const data: Database = DatabaseService.getData();
    const nextListId: string = `L${1 + Number(data.lastListId.slice(1))}`;
    const list: List = { listId: nextListId, ...listData };

    data.lists.push(list);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return list;
  }

  static retrieveList(listId: string): List | undefined {
    const data: Database = DatabaseService.getData();

    const list: List | undefined = data.lists.find((list: List) => list.listId === listId);
    if (!list) throw new Error('Not Found');
    else return list;
  }

  static updateList(listId: string, listData: Partial<List>): List {
    const data: Database = DatabaseService.getData();
    const listIndex: number = data.lists.findIndex((list: any) => list.listId === listId);
    if (listIndex === -1) throw new Error('Not Found');
    const list: List = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = list;
    DatabaseService.setData(data);

    return list;
  }

  static deleteList(listId: string): void {
    const data: Database = DatabaseService.getData();
    const totalRecords = data.lists.length;

    data.lists = data.lists.filter((list: List) => list.listId !== listId);
    if (totalRecords === data.lists.length) throw new Error('Not Found');
    else DatabaseService.setData(data);
  }
}

class DatabaseService {
  private static db: Database;
  private static filePath = path.join(__dirname, './db.json');

  static init(): void {
    this.db = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
  }

  static getData(): Database {
    return this.db;
  }

  static setData(data: Database): void {
    this.db = data;
  }

  static saveToDisk(): void {
    fs.writeFileSync(this.filePath, JSON.stringify(this.db), 'utf8');
  }
}

// DATABASE
DatabaseService.init();

// ROUTER
const app: Express = express();
const router: Router = express.Router();

// MIDDLEWARE
app.use(express.json());
app.use('/api', router);

// ROUTES
router.post('/users/register', UserController.createUser);
router.get('/users/user/:id', UserController.retrieveUser);
router.put('/users/user/:id', UserController.updateUser);
router.delete('/users/user/:id', UserController.deleteUser);
router.post('/tasks/create', TaskController.createTask);
router.get('/tasks/task/:id', TaskController.retrieveTask);
router.put('/tasks/task/:id', TaskController.updateTask);
router.delete('/tasks/task/:id', TaskController.deleteTask);
router.patch('/tasks/task/:id/complete', TaskController.completeTask);
router.post('/lists/create', ListController.createList);
router.get('/lists/list/:id', ListController.retrieveList);
router.put('/lists/list/:id', ListController.updateList);
router.delete('/lists/list/:id', ListController.deleteList);

// SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

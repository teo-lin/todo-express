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
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser: MaskedUser = await UserService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async retrieveUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const user: MaskedUser | undefined = await UserService.retrieveUser(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const updatedUser: MaskedUser = await UserService.updateUser(req.params.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
class TaskController {
  static createTask(req: Request, res: Response) {
    try {
      const newTask: Task = TaskService.createTask(req.body);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static retrieveTask(req: Request, res: Response) {
    try {
      const task: Task | undefined = TaskService.retrieveTask(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static updateTask(req: Request, res: Response) {
    try {
      const updatedTask: Task = TaskService.updateTask(req.params.id, req.body);
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static deleteTask(req: Request, res: Response) {
    try {
      TaskService.deleteTask(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static completeTask(req: Request, res: Response) {
    try {
      const taskId: string = req.params.id;
      const task: Task = TaskService.completeTask(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
class ListController {
  static async createList(req: Request, res: Response) {
    try {
      const newList: List = await ListService.createList(req.body);
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async retrieveList(req: Request, res: Response) {
    try {
      const list: List | undefined = await ListService.retrieveList(req.params.id);
      if (!list) return res.status(404).json({ message: 'List not found' });
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateList(req: Request, res: Response) {
    try {
      const updatedList: List = await ListService.updateList(req.params.id, req.body);
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteList(req: Request, res: Response) {
    try {
      await ListService.deleteList(req.params.id);
      res.json({ message: 'List deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

// SERVICES
class UserService {
  static createUser(userData: NewUser): MaskedUser {
    const data: Database = DatabaseService.getData();
    const nextUserId: string = `U${1 + Number(data.lastUserId.slice(1))}`;
    const newUser: User = { userId: nextUserId, ...userData };

    data.users.push(newUser);
    data.lastUserId = nextUserId;
    DatabaseService.setData(data);

    const { password, ...maskedUser } = newUser;
    return maskedUser;
  }

  static retrieveUser(userId: string): MaskedUser | undefined {
    const data: Database = DatabaseService.getData();
    const user: User | undefined = data.users.find((user: User) => user.userId === userId);

    if (user) {
      const { password, ...maskedUser } = user;
      return maskedUser;
    }
  }

  static updateUser(userId: string, userData: Partial<User>): MaskedUser {
    const data: Database = DatabaseService.getData();
    const userIndex: number = data.users.findIndex((user: User) => user.userId === userId);
    if (userIndex === -1) throw new Error('User not found');
    const updatedUser: User = { ...data.users[userIndex], ...userData };

    data.users[userIndex] = updatedUser;
    DatabaseService.setData(data);

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static deleteUser(userId: string): void {
    const data: Database = DatabaseService.getData();
    data.users = data.users.filter((user: User) => user.userId !== userId);
    DatabaseService.setData(data);
  }
}
class TaskService {
  static createTask(taskData: NewTask): Task {
    const data: Database = DatabaseService.getData();
    const nextTaskId: string = `T${1 + Number(data.lastTaskId.slice(1))}`;
    const newTask: Task = { taskId: nextTaskId, ...taskData };

    data.tasks.push(newTask);
    data.lastTaskId = nextTaskId;
    DatabaseService.setData(data);

    return newTask;
  }

  static retrieveTask(taskId: string): Task | undefined {
    const data: Database = DatabaseService.getData();

    return data.tasks.find((task: Task) => task.taskId === taskId);
  }

  static updateTask(taskId: string, taskData: Partial<Task>): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: any) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    const updatedTask: Task = { ...data.tasks[taskIndex], ...taskData };

    data.tasks[taskIndex] = updatedTask;
    DatabaseService.setData(data);

    return updatedTask;
  }

  static deleteTask(taskId: string): void {
    const data: Database = DatabaseService.getData();
    data.tasks = data.tasks.filter((task: Task) => task.taskId !== taskId);
    DatabaseService.setData(data);
  }

  static completeTask(taskId: string): Task {
    const data: Database = DatabaseService.getData();
    const taskIndex: number = data.tasks.findIndex((task: Task) => task.taskId === taskId);
    if (taskIndex === -1) throw new Error('Task not found');
    data.tasks[taskIndex].isComplete = true;

    DatabaseService.setData(data);
    return data.tasks[taskIndex];
  }
}
class ListService {
  static createList(listData: NewList): List {
    const data: Database = DatabaseService.getData();
    const nextListId: string = `L${1 + Number(data.lastListId.slice(1))}`;
    const newList: List = { listId: nextListId, ...listData };

    data.lists.push(newList);
    data.lastListId = nextListId;
    DatabaseService.setData(data);

    return newList;
  }

  static retrieveList(listId: string): List | undefined {
    const data: Database = DatabaseService.getData();

    return data.lists.find((list: List) => list.listId === listId);
  }

  static updateList(listId: string, listData: Partial<List>): List {
    const data: Database = DatabaseService.getData();
    const listIndex: number = data.lists.findIndex((list: any) => list.listId === listId);
    if (listIndex === -1) throw new Error('List not found');
    const updatedList: List = { ...data.lists[listIndex], ...listData };

    data.lists[listIndex] = updatedList;
    DatabaseService.setData(data);

    return updatedList;
  }

  static deleteList(listId: string): void {
    const data: Database = DatabaseService.getData();
    data.lists = data.lists.filter((list: List) => list.listId !== listId);
    DatabaseService.setData(data);
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
